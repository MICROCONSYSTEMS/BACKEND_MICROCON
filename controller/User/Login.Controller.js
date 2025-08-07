import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/index.js';
import { GetObjectURL } from '../../utils/GetObject.js';


export const LoginUser = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    let profile_picture = null;

    if (user.profile_picture?.filename) {
      const signedUrl = await GetObjectURL(`users/${user.profile_picture.filename}`);
      profile_picture = {
        filename: user.profile_picture.filename,
        url: signedUrl
      };
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        phone: user.phone,
        firstName: user.firstName,
        lastName:user.lastName,
        profile_picture,
        organization_name: user.organization_name || null,
        gst_number: user.gst_number || null
      }
    })
  }
  catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
