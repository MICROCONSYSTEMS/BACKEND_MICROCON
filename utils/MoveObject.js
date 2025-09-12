import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/AwsS3.js';
export const MoveObject = async ({ oldFolder, newFolder, filename }) => {
  const oldKey = `${oldFolder}/${filename}`;
  const newKey = `${newFolder}/${filename}`;
  const bucket = 'microcon-systems-online';

  // Copy file
  await s3Client.send(new CopyObjectCommand({
    Bucket: bucket,
    CopySource: `${bucket}/${oldKey}`,
    Key: newKey,
  }));

  // Delete old file
  await s3Client.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: oldKey,
  }));

  return {
    newUrl: `https://${bucket}.s3.amazonaws.com/${newKey}`,
    newFilename: filename
  };
};
