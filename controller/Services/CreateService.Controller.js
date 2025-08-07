import { Service } from "../../models/index.js";
import { PutObject } from '../../utils/PutObject.js';

export const CreateService = async (req, res) => {
    try {
        let { title, description, features, formLink } = req.body;
        const file = req.file;

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

        // Parse features
        if (typeof features === 'string') {
            try {
                features = JSON.parse(features);
            } catch {
                features = features.split(',').map(f => f.trim()).filter(Boolean);
            }
        };

        if (!Array.isArray(features)) {
            return res.status(400).json({ message: "Features must be a non-empty array" });
        }

        if (features.some(f => typeof f !== 'string' || !f.trim())) {
            return res.status(400).json({ message: "Each feature must be a valid non-empty string" });
        }

        // Validate image
        if (!file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        // Upload image
        let uploaded;
        try {
            uploaded = await PutObject({
                folderName: "services",
                fileName: file.originalname,
                fileBuffer: file.buffer,
                contentType: file.mimetype,
            });
        } catch (uploadError) {
            return res.status(500).json({ message: "Failed to upload image" });
        }

        const serviceData = {
            title: title.trim(),
            description: description.trim(),
            formLink: formLink.trim(),
            features,
            image: {
                fileName: uploaded.filename,
                url: uploaded.url,
            }
        };

        const newService = new Service(serviceData);
        await newService.save();

        res.status(201).json(newService);
    } catch (error) {
        console.error("CreateService error:", error);
        res.status(500).json({ message: error.message || "Failed to create service" });
    }
};
