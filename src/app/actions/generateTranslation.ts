'use server';

import { Config, defaultConfig } from '@/lib/config';
import { generateTranslationIntruction } from '@/lib/openAi';
import { S3Service } from '@/lib/s3';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

export const generateTranslation = async (
  oldLanguage: string,
  newLanguage: string,
  translation: string,
  options?: { context?: string; translateKeys?: boolean },
): Promise<void> => {
  const cookiesConfig = cookies().get('config')?.value;
  const config: Config = cookiesConfig ? JSON.parse(cookiesConfig) : defaultConfig;

  const openai = new OpenAI({
    apiKey: config.openai.apiKey ?? '',
    project: config.openai.projectId ?? '',
  });

  const instructionMessage: ChatCompletionMessageParam = {
    role: 'system',
    content: generateTranslationIntruction,
  };

  const s3Service = new S3Service(config);
  const translationData = JSON.parse(await s3Service.getObject(`${oldLanguage}/${translation}.json`));

  let response: OpenAI.Chat.Completions.ChatCompletion;

  try {
    response = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        instructionMessage,
        {
          role: 'user',
          content: JSON.stringify({
            oldLanguage,
            newLanguage,
            translation: translationData,
            options,
          }),
        },
      ],
    });
  } catch (error) {
    throw new Error('Translation failed');
  }

  const responseMessage = response.choices[0].message.content;

  if (!responseMessage) {
    throw new Error('Translation failed');
  }

  await s3Service.putObject(`${newLanguage}/${translation}.json`, responseMessage);

  revalidateTag('translations');
};
