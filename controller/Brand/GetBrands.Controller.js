import { Brand } from "../../models/index.js";
import { GetObjectURL } from "../../utils/GetObject.js";

export const GetBrands = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = search.trim()
      ? { name: { $regex: search.trim(), $options: 'i' } }
      : {};

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const brands = await Brand.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Brand.countDocuments(query);

    for (let brand of brands) {
      if (brand.images?.filename) {
        const key = `brands/${brand.images.filename}`;
        brand.images.url = await GetObjectURL(key);
      }
    }

    return res.status(200).json({
      message: "Brands fetched successfully",
      status: true,
      data: brands,
      pagination: {
        totalItems: total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching brands",
      status: false,
      data: error.message
    });
  }
};
