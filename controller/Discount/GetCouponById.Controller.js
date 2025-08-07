import { Discount } from "../../models/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { ConvertIntoMongoID } from "../../utils/ConvertIntoMongoID.js";

export const GetCouponById = async (req, res) => {
  try {
    const { couponId } = req.params;
    if (!couponId) return res.status(400).json({ message: "Coupon ID is required" });

    const couponObjectId = ConvertIntoMongoID(couponId);

    const coupon = await Discount.findOne({
      _id: couponObjectId,
      isActive: true
    });

    if (!coupon) return res.status(404).json({ message: "Coupon not found or inactive" });

    res.status(200).json({ coupon });

  } catch (error) {
    handleError(res, error, "Error fetching coupon");
  }
};
