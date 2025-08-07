import { User, Wishlist, Order, AddressBook, Cart } from '../../models/index.js';
import { GetObjectURL } from '../../utils/GetObject.js';

export const GetUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password -passwordResetToken -passwordResetExpires');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let profile_picture = user.profile_picture;
    if (profile_picture?.filename) {
      const signedUrl = await GetObjectURL(`users/${profile_picture.filename}`);
      profile_picture.url = signedUrl;
    }

    const wishlist = await Wishlist.findOne({ userId }).populate('productIds');

    const orders = await Order.find({ userId }).populate('products.productId');

    const addresses = await AddressBook.find({ userId });

    const cart = await Cart.findOne({ userId }).populate('products.productId');

    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: {
        user: {
          ...user.toObject(),
          profile_picture
        },
        wishlist: wishlist?.productIds || [],
        orders,
        addresses,
        cart
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: err.message
    });
  }
};
