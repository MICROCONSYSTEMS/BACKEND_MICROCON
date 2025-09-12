import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/AwsS3.js";

export const DeleteObject = async (key) => {
  try {
    if (!key) {
      throw new Error("No S3 key provided");
    }

    const command = new DeleteObjectCommand({
      Bucket: 'microcon-systems-online',
      Key: key
    });

    await s3Client.send(command);

    return {
      success: true,
      message: `Deleted ${key} from S3`
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete file from S3",
      error: error.message
    };
  }
};
