import bcrypt from 'bcryptjs';
import { User } from '../../models/index.js';
import jwt from 'jsonwebtoken';
import { PutObject } from '../../utils/PutObject.js'; 

export const AddAdmin = async (req, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { firstName, middleName, lastName, email, password, phone } = req.body;
    const file = req.file;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin with this email already exists.' });
    }

    let profile_picture = {};
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

    const admin = await User.create({
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: 'admin',
      profile_picture
    });

    const token = jwt.sign({ userId: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      token,
      admin: {
        _id: admin._id,
        name: `${admin.firstName} ${admin.lastName}`,
        email: admin.email,
        role: admin.role,
        profile_picture
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
