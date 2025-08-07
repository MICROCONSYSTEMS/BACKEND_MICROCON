import { TeamMember } from "../../models/index.js";
import {PutObject} from '../../utils/PutObject.js'

export const AddMember = async (req, res) => {
  try {
    console.log(req.body);
    const { name, position, contact, email } = req.body;

    if (!req.file) return res.status(400).json({ message: "Photo is required" });

    const photoDetails = await PutObject({
      folderName: "teamMembers",
      fileName: req.file.originalname,
      fileBuffer: req.file.buffer,
      contentType: req.file.mimetype,
    });

    if (!photoDetails.url) throw new Error("Failed to upload image");

    const newMember = await TeamMember.create({
      name,
      position,
      contact,
      email,
      photo: {
        filename: photoDetails.filename,
        url: photoDetails.url,
        key: `teamMembers/${photoDetails.filename}`,
      },
    });

    res.status(201).json({ message: "Member added", data: newMember });
  } catch (error) {
    res.status(500).json({ message: "Failed to add member", error: error.message });
  }
};