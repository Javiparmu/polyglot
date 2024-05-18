'use server';

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { revalidateTag } from 'next/cache';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const deleteTranslation = async (language: string, translation: string): Promise<void> => {
  const deleteObjectParams = {
    Bucket: process.env.S3_TRANSLATIONS_BUCKET,
    Key: `${language}/${translation}.json`,
  };

  await s3.send(new DeleteObjectCommand(deleteObjectParams));

  revalidateTag('translations');
};
