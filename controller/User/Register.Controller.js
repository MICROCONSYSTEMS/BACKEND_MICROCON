import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/index.js';
import { PutObject } from '../../utils/PutObject.js';


export const RegisterUser = async (req, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { firstName, middleName, lastName, email, password, phone, role, organization_name, gst_number } = req.body;
    const file = req.file;

    console.log(req.body);

    if (!firstName || !lastName || !email || !password || !phone || !organization_name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const roleToSet = role || 'customer';

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const existingUserWithPhone = await User.findOne({ phone });
    if (existingUserWithPhone) return res.status(400).json({ message: 'Phone number already exists' });

    let profile_picture = [];
    if (file) {
      const { buffer, originalname, mimetype } = file;
      const uploaded = await PutObject({
        folderName: 'users',
        fileName: `${Date.now()}_${originalname}`,
        fileBuffer: buffer,
        contentType: mimetype
      });
      profile_picture = uploaded;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: roleToSet,
      profile_picture,
      organization_name,
      gst_number
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        role: newUser.role,
        profile_picture
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
