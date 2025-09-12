import { User } from "../../models/index.js";
import { s3Client } from "../../config/AwsS3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const DeleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin.profile_picture?.filename) {
      const deleteParams = {
        Bucket: "microcon-systems-online", 
        Key: `users/${admin.profile_picture.filename}`,
      };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
    }

    await User.findByIdAndDelete(adminId);

    res.status(200).json({
      success: true,
      message: "Admin and profile picture deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete admin",
      error: err.message,
    });
  }
};
