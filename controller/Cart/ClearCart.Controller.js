import { Cart } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js'

export const ClearCart = async (req, res) => {
    try {
      const userId = ConvertIntoMongoID(req.params.userId);
      const cart = await Cart.findOne({ userId });
      if (!cart) throw new Error('Cart not found');
  
      cart.products = [];
      await cart.save();
  
      return res.status(200).json({ success: true, message: 'Cart cleared', data: cart });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };