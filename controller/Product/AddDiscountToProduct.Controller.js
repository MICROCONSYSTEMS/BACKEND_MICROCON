import { Product, Discount } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { handleError } from '../../utils/errorHandler.js';

export const AddDiscountToProduct = async (req, res) => {
  try {
    const productId = ConvertIntoMongoID(req.params.id);
    const discountId = ConvertIntoMongoID(req.body.discountId);

    const [product, discount] = await Promise.all([
      Product.findById(productId),
      Discount.findOne({ _id: discountId, isActive: true, deletedAt: null })
    ]);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.', status: false });
    }
    if (!discount) {
      return res.status(400).json({ message: 'Discount not found or inactive.', status: false });
    }

    if (!product.discountId.includes(discountId)) {
      product.discountId.push(discountId);
      await product.save();
    }

    // Add productId to Discount.appliesToProducts if not already present
    if (!discount.appliesToProducts.includes(productId)) {
      discount.appliesToProducts.push(productId);
      await discount.save();
    }

    res.status(200).json({ message: 'Discount added successfully.', status: true, data: product });

  } catch (error) {
    handleError(res, error);
  }
};
