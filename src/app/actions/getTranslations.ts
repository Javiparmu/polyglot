'use server'

import { formatJson } from "@/lib/helpers";
import { Translation } from "@/lib/types";
import { GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import pLimit from "p-limit";

const defaultConcurrency = 10

const s3 = new S3Client({ region: process.env.AWS_REGION })

export const getTranslations = async (): Promise<Translation> => {
    const listObjects = new ListObjectsV2Command({
        Bucket: process.env.S3_TRANSLATIONS_BUCKET,
        Prefix: process.env.S3_TRANSLATIONS_KEY,
    });

    const { Contents } = await s3.send(listObjects);

    if (!Contents) {
        return {} as Translation;
    }

    let translations = {} as any;

    const limit = pLimit(
        process.env.S3_DOWNLOAD_CONCURRENCY ? Number(process.env.S3_DOWNLOAD_CONCURRENCY) : defaultConcurrency,
    );

    await Promise.all(
        Contents.map((file) =>
            limit(async () => {
                const getObjectParams = {
                    Bucket: process.env.S3_TRANSLATIONS_BUCKET,
                    Key: file.Key,
                };

                console.log("params", getObjectParams)

                const { Body } = await s3.send(new GetObjectCommand(getObjectParams));

                console.log('Body', await Body?.transformToString())

                if (!Body || !file.Key) {
                    return;
                }

                let translationData = '';
                for await (const chunk of Body as unknown as string) {
                    console.log('chunk', chunk)
                    translationData += chunk;
                }

                console.log('translationData', translationData)

                if (!translationData) {
                    return;
                }

                translations = {
                    ...translations,
                    [file.Key.split('/')[0]]: {
                    ...translations[file.Key.split('/')[0]],
                    [file.Key.split('/')[1].split('.')[0]]: formatJson(translationData),
                    },
                };
            }),
        ),
    );

    console.log("translations", translations)

    return { translations }
}