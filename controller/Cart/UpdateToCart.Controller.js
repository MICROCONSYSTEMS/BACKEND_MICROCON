import { Cart } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { GetObjectURL } from '../../utils/GetObject.js';

export const UpdateCart = async (req, res) => {
  try {
    const userId = ConvertIntoMongoID(req.params.userId);
    const { productId, quantity } = req.body;

    if (quantity < 1) throw new Error('Quantity cannot be less than 1');

    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    const itemIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) throw new Error('Product not in cart');

    cart.products[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate('products.productId'); // Populate in-place

    const products = await Promise.all(cart.products.map(async (item) => {
      const product = item.productId.toObject();
      const folder = product.productType === 'component' ? 'component-files' : 'assembly-files';

      const signedImages = await Promise.all(
        (product.images || []).map(async (img) => {
          if (img?.filename) {
            const key = `${folder}/${img.filename}`;
            const url = await GetObjectURL(key);
            return { ...img, url };
          }
          return img;
        })
      );

      let manual = product.manual;
      if (manual?.filename) {
        const key = `${folder}/${manual.filename}`;
        const url = await GetObjectURL(key);
        manual = { ...manual, url };
      }

      return {
        _id: item._id,
        product: {
          ...product,
          images: signedImages,
          manual,
        },
        quantity: item.quantity
      };
    }));

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: { products }
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};