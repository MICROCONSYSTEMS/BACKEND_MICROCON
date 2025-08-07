import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/AwsS3.js";

export const GetObjectURL = async (key) => {
  try {
    if (!key) throw new Error("No S3 key provided");

    const command = new GetObjectCommand({
      Bucket: "microcon-systems",
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error.message);
    return null;
  }
};
