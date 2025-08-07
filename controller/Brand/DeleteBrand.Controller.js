import { Brand, Product } from "../../models/index.js";
import { ConvertIntoMongoID } from "../../utils/ConvertIntoMongoID.js";
import { DeleteObject } from "../../utils/DeleteObject.js";

export const DeleteBrand = async (req, res) => {
  try {
    const brandId = ConvertIntoMongoID(req.params.id);

    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
        status: false,
        data: null
      });
    }

    if (brand.images?.filename) {
      const s3Key = `brands/${brand.images.filename}`;
      await DeleteObject(s3Key);
    }

    await brand.deleteOne();

    await Product.updateMany(
      { brandId },
      { $unset: { brandId: null } }
    );

    return res.status(200).json({
      message: "Brand deleted successfully and image removed from S3",
      status: true,
      data: brand
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error deleting brand",
      status: false,
      data: error.message
    });
  }
};
