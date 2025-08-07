import { Brand } from "../../models/index.js";
import { ConvertIntoMongoID } from "../../utils/ConvertIntoMongoID.js";
import { GetObjectURL } from "../../utils/GetObject.js"; 

export const GetBrandById = async (req, res) => {
  try {
    const brandId = ConvertIntoMongoID(req.params.id);

    const brand = await Brand.findById(brandId).lean();
    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
        status: false,
        data: null
      });
    }

    if (brand.images?.filename) {
      const key = `brands/${brand.images.filename}`;
      const signedUrl = await GetObjectURL(key);
      brand.images.url = signedUrl;
    }

    return res.status(200).json({
      message: "Brand fetched successfully",
      status: true,
      data: brand
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching brand",
      status: false,
      data: error.message
    });
  }
};
