import { Service } from "../../models/index.js";
import { DeleteObject } from '../../utils/DeleteObject.js';
import { PutObject } from '../../utils/PutObject.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const UpdateService = async (req, res) => {
    try {
        const id = ConvertIntoMongoID(req.params.id);
        const file = req.file;
        const { title, description, formLink } = req.body;
        let { features } = req.body;

        console.log(features);

        // Validate individual required fields
        if (!title?.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }
        if (!description?.trim()) {
            return res.status(400).json({ message: "Description is required" });
        }
        if (!formLink?.trim()) {
            return res.status(400).json({ message: "Form link is required" });
        }
        if (!features) {
            return res.status(400).json({ message: "Features are required" });
        }

        const existing = await Service.findById(id);
        if (!existing) return res.status(404).json({ message: "Service not found" });

        if (typeof features === 'string') {
            try {
                features = JSON.parse(features);
            } catch {
                features = features.split(',').map(f => f.trim()).filter(Boolean);
            }
        }

        if (!Array.isArray(features)) {
            return res.status(400).json({ message: "Features must be a non-empty array" });
        }

        if (features.some(f => typeof f !== 'string' || !f.trim())) {
            return res.status(400).json({ message: "Each feature must be a valid non-empty string" });
        }

        let imageObj = existing.image;

        if (file) {
            try {
                await DeleteObject(existing.image.fileName);
                const { filename, url } = await PutObject({
                    folderName: "services",
                    fileName: file.originalname,
                    fileBuffer: file.buffer,
                    contentType: file.mimetype,
                });
                imageObj = { fileName: filename, url };
            } catch (err) {
                return res.status(500).json({ message: "Failed to upload image" });
            }
        }

        const updatePayload = {
            title: title.trim(),
            description: description.trim(),
            formLink: formLink.trim(),
            features,
            image: imageObj,
        };

        const updated = await Service.findByIdAndUpdate(id, updatePayload, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        console.error("UpdateService error:", error);
        res.status(500).json({ message: error.message || "Failed to update service" });
    }
};
