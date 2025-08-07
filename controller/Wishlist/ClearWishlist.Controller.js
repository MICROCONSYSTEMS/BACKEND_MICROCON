import { Wishlist } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const ClearWishlist = async (req, res) => {
  try {
    const userId = ConvertIntoMongoID(req.params.userId);

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) throw new Error('Wishlist not found');

    wishlist.productIds = [];
    await wishlist.save();
    res.status(200).json(
      {
        success: true,
        message: 'Wishlist cleared',
        data: wishlist
      });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};