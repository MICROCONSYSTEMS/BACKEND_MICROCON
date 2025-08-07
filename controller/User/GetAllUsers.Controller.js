import { User } from '../../models/index.js';
import { GetObjectURL } from '../../utils/GetObject.js';

export const GetAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -passwordResetToken -passwordResetExpires');

    const usersWithUrl = await Promise.all(
      users.map(async (user) => {
        let profile_picture = user.profile_picture;

        if (profile_picture && profile_picture.filename) {
          const signedUrl = await GetObjectURL(`users/${profile_picture.filename}`);
          profile_picture.url = signedUrl;
        }

        return {
          ...user.toObject(),
          profile_picture
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: usersWithUrl
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: err.message
    });
  }
};
