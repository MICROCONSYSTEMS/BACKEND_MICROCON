import { User } from '../../models/index.js'
import { PutObject } from '../../utils/PutObject.js'
import { DeleteObject } from '../../utils/DeleteObject.js'

export const EditAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { firstName, middleName, lastName, phone } = req.body;
        const file = req.file;

        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        if (file && admin.profile_picture?.filename) {
            const oldKey = `users/${admin.profile_picture.filename}`;
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

            admin.profile_picture = uploaded;
        }

        admin.firstName = firstName || admin.firstName;
        admin.middleName = middleName || admin.middleName;
        admin.lastName = lastName || admin.lastName;
        admin.phone = phone || admin.phone;

        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Admin updated successfully',
            data: admin
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update admin',
            error: err.message
        });
    }
};
