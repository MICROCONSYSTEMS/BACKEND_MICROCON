import { Cart } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js'

export const AddToCart = async (req, res) => {
    try {
      const userId = ConvertIntoMongoID(req.params.userId);
      const { productId, quantity } = req.body;
  
      if (quantity < 1) throw new Error('Quantity cannot be less than 1');
  
      const productObjectId = ConvertIntoMongoID(productId);
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, products: [{ productId: productObjectId, quantity }] });
      } else {
        const itemIndex = cart.products.findIndex(
          (item) => item.productId.toString() === productId
        );
  
        if (itemIndex > -1) {
          cart.products[itemIndex].quantity += quantity;
        } else {
          cart.products.push({ productId: productObjectId, quantity });
        }
      }
  
      await cart.save();
      return res.status(200).json({ success: true, message: 'Product added to cart', data: cart });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };