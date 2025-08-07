import { Discount } from '../../models/index.js';
import { handleError } from '../../utils/errorHandler.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const DeleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    if (!couponId) return res.status(400).json({ message: 'Coupon ID is required' });

    const couponObjectId = ConvertIntoMongoID(couponId);

    const deletedCoupon = await Discount.findByIdAndUpdate(
      couponObjectId,
      {
        isActive: false,
        deletedAt: new Date()
      },
      { new: true }
    ).lean();

    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json({ message: 'Coupon soft-deleted successfully' });

  } catch (error) {
    handleError(res, error, 'Error soft-deleting coupon');
  }
};
