import { User } from '../../models/index.js';
import { PutObject } from '../../utils/PutObject.js';
import { DeleteObject } from '../../utils/DeleteObject.js'

export const EditProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, middleName, lastName, phone, email } = req.body;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (firstName) user.firstName = firstName;
    if (middleName !== undefined) user.middleName = middleName;
    if (lastName) user.lastName = lastName;
    if (email && email !== user.email) {
      const existingUserWithEmail = await User.findOne({ email });
      if (existingUserWithEmail && existingUserWithEmail._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      user.email = email;
    }
    if (phone && phone !== user.phone) {
      const existingUserWithPhone = await User.findOne({ phone });
      if (existingUserWithPhone && existingUserWithPhone._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already exists'
        });
      }
      user.phone = phone;
    }

    if (file && user.profile_picture?.filename) {
      const oldKey = `users/${user.profile_picture.filename}`;
      await DeleteObject(oldKey);
    }

    if (file) {
      const { buffer, originalname, mimetype } = file;
      const uploaded = await PutObject({
        folderName: 'users',
        fileName: `${Date.now()}_${originalname}`,
        fileBuffer: buffer,
        contentType: mimetype
      });

      user.profile_picture = uploaded;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        profile_picture: user.profile_picture,
        role:user.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: err.message
    });
  }
};
