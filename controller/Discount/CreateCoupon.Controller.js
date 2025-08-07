import { Discount, Product } from '../../models/index.js';
import { handleError } from '../../utils/errorHandler.js';

export const CreateCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minimumOrderAmount = 0,
      appliesToOrder,
      appliesToProducts = [],
      expiryDate
    } = req.body;

    const trimmedCode = code?.trim().toUpperCase();
    if (!trimmedCode) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const existingCoupon = await Discount.findOne({ code: trimmedCode });
    if (existingCoupon) {
      return res.status(409).json({ message: 'Coupon code already exists' });
    }

    if (expiryDate && new Date(expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Expiry date must be in the future' });
    }

    const newCoupon = new Discount({
      code: trimmedCode,
      discountType,
      discountValue,
      minimumOrderAmount,
      appliesToOrder,
      appliesToProducts,
      expiryDate
    });

    await newCoupon.save();

    if (Array.isArray(appliesToProducts) && appliesToProducts.length > 0) {
      await Product.updateMany(
        { _id: { $in: appliesToProducts } },
        { $addToSet: { discountId: newCoupon._id } }
      );
    }

    res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });

  } catch (error) {
    handleError(res, error, 'Error creating coupon');
  }
};
