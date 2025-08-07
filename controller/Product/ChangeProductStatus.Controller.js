import { Product } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { handleError } from '../../utils/errorHandler.js';

export const ChangeProductStatus = async (req, res) => {
  try {
    const productId = ConvertIntoMongoID(req.params.id);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.', status: false });
    }

    product.status = !product.status;
    await product.save();

    res.status(200).json({
      message: `Product status changed to ${product.status ? 'Active' : 'Inactive'}.`,
      status: true,
      data: { _id: product._id, status: product.status }
    });
  } catch (error) {
    handleError(res, error);
  }
};
