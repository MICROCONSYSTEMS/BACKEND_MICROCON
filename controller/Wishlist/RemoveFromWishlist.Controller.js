import { Wishlist } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const RemoveFromWishlist = async (req, res) => {
    try {
      const userId = ConvertIntoMongoID(req.params.userId);
      const productId = ConvertIntoMongoID(req.params.productId);
  
      const wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) throw new Error('Wishlist not found');
  
      wishlist.productIds = wishlist.productIds.filter(
        (id) => id.toString() !== productId.toString()
      );
  
      await wishlist.save();
      res.status(200).json({ success: true, message: 'Product removed from wishlist', data: wishlist });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };