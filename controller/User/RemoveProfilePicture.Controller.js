import { User } from "../../models/index.js";
import { DeleteObject } from '../../utils/DeleteObject.js'

export const RemoveProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const filename = user.profile_picture?.filename;
    if (filename) {
      const key = `users/${filename}`;
      await DeleteObject(key);
    }

    user.profile_picture = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture removed successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove profile picture',
      error: err.message
    });
  }
};
