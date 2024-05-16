import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
  project: process.env.OPENAI_PROJECT_ID ?? '',
});

const instructionMessage: ChatCompletionMessageParam = {
  role: 'system',
  content: `
    I will give you a text in json format and a language to translate it to.
    You should return the translated text in json format. If I don't specify otherwise in the options, you should keep the keys in its original language.
    The values of the json to translate can be in markdown format, so keep that in mind when translating.
    I can pass a context to clarify what the translation is about.
    The format of the user message will be:
    {
      "oldLanguage": "en",
      "newLanguage": "es",
      "translation": "*text to translate in json*",
      "options": {
        "context": "context of the translation",
        "translateKeys": false // if this doesn't exist, you should keep the keys in its original language
      } // Optional
    }
    The response should just be the translation in json format.
    Don't add any text to the response, just the translated text with the format I specified.
  `,
};

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { oldLanguage, newLanguage, translation, options } = await req.json();

  const getObjectParams = {
    Bucket: process.env.S3_TRANSLATIONS_BUCKET,
    Key: `${oldLanguage}/${translation}.json`,
  };

  const { Body } = await s3.send(new GetObjectCommand(getObjectParams));

  if (!Body) {
    return NextResponse.json({ message: 'Translation not found' }, { status: 404 });
  }

  const translationData = JSON.parse(await Body.transformToString());

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
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
    n: 1,
  });

  const responseMessage = response.choices[0].message.content;

  if (!responseMessage) {
    return NextResponse.json({ message: 'Translation failed' }, { status: 500 });
  }

  const putObjectParams = {
    Bucket: process.env.S3_TRANSLATIONS_BUCKET,
    Key: `${newLanguage}/${translation}.json`,
    Body: responseMessage,
  };

  await s3.send(new PutObjectCommand(putObjectParams));

  return NextResponse.json({ message: 'Translation created' });
}
