import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {s3Client} from '../config/AwsS3.js'

export const PutObject = async ({ folderName, fileName, fileBuffer, contentType }) => {
    try {
        const key = `${folderName}/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: 'microcon-systems',
            Key: key,
            Body: fileBuffer,
            ContentType: contentType || 'application/octet-stream'
        });

        await s3Client.send(command);

        const url = await getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: 'microcon-systems',
            Key: key
        }));

        return {
            filename: fileName,
            url
          };
    } catch (error) {
        return error;
    }
};