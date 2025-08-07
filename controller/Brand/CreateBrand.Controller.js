import { Brand } from "../../models/index.js";
import { PutObject } from "../../utils/PutObject.js";

export const CreateBrand = async (req, res) => {
  try {

    let { name, description } = req.body;
    name = name?.trim();

    if (!name) {
      return res.status(400).json({
        message: "Brand name is required",
        status: false,
        data: null
      });
    }

    const existing = await Brand.findOne({
      name: { $regex: `^${name}$`, $options: "i" }
    });

    if (existing) {
      return res.status(400).json({
        message: "Brand already exists",
        status: false,
        data: null
      });
    }

    let imageData = {};
    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;

      const result = await PutObject({
        folderName: "brands",
        fileName: `${Date.now()}_${originalname}`,
        fileBuffer: buffer,
        contentType: mimetype
      });

      imageData = {
        filename: result.filename,
        url: result.url
      };
    }

    const brand = await Brand.create({
      name,
      description,
      images: imageData
    });

    return res.status(201).json({
      message: "Brand created successfully",
      status: true,
      data: brand
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      status: false,
      data: error.message
    });
  }
};
