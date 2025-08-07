import { Product, Discount } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { handleError } from '../../utils/errorHandler.js';

export const RemoveDiscountFromProduct = async (req, res) => {
  try {
    const productId = ConvertIntoMongoID(req.params.id);
    const discountId = ConvertIntoMongoID(req.body.discountId);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.', status: false });
    }

    // Step 1: Remove the discountId from product's discountId array
    product.discountId = product.discountId.filter(
      (id) => id.toString() !== discountId.toString()
    );
    await product.save();

    // Step 2: Remove productId from discount's appliesToProducts array
    await Discount.findByIdAndUpdate(discountId, {
      $pull: { appliesToProducts: productId }
    });

    res.status(200).json({ message: 'Discount removed successfully.', status: true, data: product });

  } catch (error) {
    handleError(res, error);
  }
};
