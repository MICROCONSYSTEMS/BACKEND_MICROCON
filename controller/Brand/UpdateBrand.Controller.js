import { Brand } from "../../models/index.js";
import { ConvertIntoMongoID } from "../../utils/ConvertIntoMongoID.js";
import { DeleteObject } from "../../utils/DeleteObject.js";
import { PutObject } from "../../utils/PutObject.js";

export const UpdateBrand = async (req, res) => {
  try {
    let { name, description } = req.body;
    const brandId = ConvertIntoMongoID(req.params.id);

    if(!name){
      return res.status(400).json({
        message: "Brand name is required",
        status: false,
        data: null
      });
    }

    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
        status: false,
        data: null
      });
    }

    if (name) {
      name = name.trim();

      const existing = await Brand.findOne({
        name: { $regex: `^${name}$`, $options: "i" },
        _id: { $ne: brandId }
      });

      if (existing) {
        return res.status(400).json({
          message: "Brand name already exists",
          status: false,
          data: null
        });
      }

      brand.name = name;
    }

    if (description !== undefined) {
      brand.description = description;
    }

    if (req.file) {
      if (brand.images?.filename) {
        const oldKey = `brands/${brand.images.filename}`;
        await DeleteObject(oldKey);
      }

      const { originalname, buffer, mimetype } = req.file;
      const result = await PutObject({
        folderName: "brands",
        fileName: `${Date.now()}_${originalname}`,
        fileBuffer: buffer,
        contentType: mimetype
      });

      brand.images = {
        filename: result.filename,
        url: result.url
      };
    }

    const updatedBrand = await brand.save();

    return res.status(200).json({
      message: "Brand updated successfully",
      status: true,
      data: updatedBrand
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error updating brand",
      status: false,
      data: error.message
    });
  }
};
