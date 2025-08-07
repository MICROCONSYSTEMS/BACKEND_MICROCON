import { Cart } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { GetObjectURL } from '../../utils/GetObject.js';

export const RemoveFromCart = async (req, res) => {
  try {
    const userId = ConvertIntoMongoID(req.params.userId);
    const productId = ConvertIntoMongoID(req.params.productId);

    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate({
      path: 'products.productId',
      populate: { path: 'discountId' },
    });

    const products = await Promise.all(
      updatedCart.products.map(async (item) => {
        const product = item.productId.toObject(); // convert mongoose doc to plain object
        const folder = product.productType === 'component' ? 'component-files' : 'assembly-files';

        // Sign image URLs
        const signedImages = await Promise.all(
          (product.images || []).map(async (img) => {
            if (img?.filename) {
              const key = `${folder}/${img.filename}`;
              const url = await GetObjectURL(key);
              return { ...img.toObject?.(), url };
            }
            return img;
          })
        );

        // Sign manual URL
        let manual = product.manual;
        if (manual?.filename) {
          const key = `${folder}/${manual.filename}`;
          const url = await GetObjectURL(key);
          manual = { ...manual.toObject?.(), url };
        }

        return {
          _id: item._id,
          product: {
            ...product,
            images: signedImages,
            manual,
          },
          quantity: item.quantity,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      data: { products },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
