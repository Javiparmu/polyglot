'use server'

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { revalidateTag } from "next/cache"

const s3 = new S3Client({ region: process.env.AWS_REGION })

export const createTranslation = async (language: string, translation: string) => {
    const putObjectParams = {
        Bucket: process.env.S3_TRANSLATIONS_BUCKET,
        Key: `${language}/${translation}.json`,
        Body: JSON.stringify({}),
    };

    const command = new PutObjectCommand(putObjectParams);

    await s3.send(command);

    revalidateTag('translations')
}