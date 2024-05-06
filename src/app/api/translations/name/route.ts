import { CopyObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const { language, oldName, newName } = await req.json();

  const copyObjectParams = {
    Bucket: process.env.S3_TRANSLATIONS_BUCKET,
    CopySource: `${process.env.S3_TRANSLATIONS_BUCKET}/${language}/${oldName}.json`,
    Key: `${language}/${newName}.json`,
  };

  await s3.send(new CopyObjectCommand(copyObjectParams));

  const deleteObjectParams = {
    Bucket: process.env.S3_TRANSLATIONS_BUCKET,
    Key: `${language}/${oldName}.json`,
  };

  await s3.send(new DeleteObjectCommand(deleteObjectParams));

  return NextResponse.json({ message: 'Translation name updated' });
}
