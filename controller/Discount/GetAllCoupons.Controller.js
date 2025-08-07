import { Discount } from "../../models/index.js";
import { handleError } from "../../utils/errorHandler.js";

export const GetAllCoupons = async (req, res) => {
  try {
    const { status, appliesTo, search } = req.query;

    let filter = {};

    // Status filter
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    // Applies to filter
    if (appliesTo === 'order') {
      filter.appliesToOrder = true;
    } else if (appliesTo === 'product') {
      filter.appliesToOrder = false;
      filter.appliesToProducts = { $exists: true, $ne: [] };
    } else if (appliesTo === 'none') {
      filter.appliesToOrder = { $ne: true };
      filter.$or = [
        { appliesToProducts: { $exists: false } },
        { appliesToProducts: { $size: 0 } }
      ];
    }

    // Search by code (case-insensitive)
    if (search) {
      filter.code = { $regex: search, $options: 'i' };
    }

    const coupons = await Discount.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "appliesToProducts",
        select: "name product_number",
        match: { status: true }
      });

    res.status(200).json({
      statusCode: 200,
      message: "Coupons fetched successfully",
      data: coupons,
    });
  } catch (error) {
    handleError(res, error, "Error fetching coupons");
  }
};
