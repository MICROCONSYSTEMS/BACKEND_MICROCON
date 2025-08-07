import { Wishlist } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const AddToWishlist = async (req, res) => {
  try {
    const userId = ConvertIntoMongoID(req.params.userId);
    const productId = ConvertIntoMongoID(req.params.productId);

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, productIds: [productId] });
    } else if (!wishlist.productIds.includes(productId)) {
      wishlist.productIds.push(productId);
    }

    await wishlist.save();
    res.status(200).json(
      {
        success: true,
        message: 'Product added to wishlist',
        data: wishlist
      });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};