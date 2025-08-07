import { Wishlist } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const GetWishlist = async (req, res) => {
  try {
    const userId = ConvertIntoMongoID(req.params.userId);
    const wishlist = await Wishlist.findOne({ userId }).populate('productIds');
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });
    res.status(200).json({ success: true, data: wishlist });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};