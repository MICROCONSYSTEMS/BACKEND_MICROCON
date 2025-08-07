import { Discount } from "../../models/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { ConvertIntoMongoID } from "../../utils/ConvertIntoMongoID.js";

export const EditCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
   
    if (!couponId) {
      return res.status(400).json({
        statusCode: 400,
        message: "Coupon ID is required",
        data: null,
      });
    }

    const couponObjectId = ConvertIntoMongoID(couponId);
    let updates = req.body;

    console.log("Received updates:", updates);

    if (updates.code) {
      updates.code = updates.code.trim().toUpperCase();
    }

    if (updates.appliesToOrder && updates.appliesToProducts?.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Coupon cannot apply to both order and products",
        data: null,
      });
    }

    if (typeof updates.isActive === "boolean") {
      updates.deletedAt = updates.isActive ? null : new Date();
    }

    const updatedCoupon = await Discount.findByIdAndUpdate(
      couponObjectId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({
        statusCode: 404,
        message: "Coupon not found",
        data: null,
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Coupon updated successfully",
      data: updatedCoupon,
    });
  } catch (error) {
    handleError(res, error, "Error updating coupon");
  }
};
