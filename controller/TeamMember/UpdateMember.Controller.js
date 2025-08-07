import { TeamMember } from "../../models/index.js";
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js'
import { DeleteObject } from '../../utils/DeleteObject.js'
import { PutObject } from "../../utils/PutObject.js";

export const UpdateMember = async (req, res) => {
    try {
        console.log(req.body);
        const memberId = ConvertIntoMongoID(req.params.memberId);
        console.log(memberId);
        const { name, position, contact, email } = req.body;
        console.log(name, position, contact, email)

        const existing = await TeamMember.findById(memberId);
        if (!existing) return res.status(404).json({ message: "Member not found" });

        let photoData = existing.photo;

        if (req.file) {
            // Delete old image
            if (photoData.key) await DeleteObject(photoData.key);

            const uploaded = await PutObject({
                folderName: "teamMembers",
                fileName: req.file.originalname,
                fileBuffer: req.file.buffer,
                contentType: req.file.mimetype,
            });

            if (!uploaded.url) throw new Error("Image upload failed");

            photoData = {
                filename: uploaded.filename,
                url: uploaded.url,
                key: `teamMembers/${uploaded.filename}`,
            };
        }

        const updated = await TeamMember.findByIdAndUpdate(
            memberId,
            { name, position, contact, email, photo: photoData },
            { new: true }
        );

        res.status(200).json({ message: "Member updated", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Failed to update member", error: error.message });
    }
};