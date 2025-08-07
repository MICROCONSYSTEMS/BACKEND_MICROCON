import express from 'express';
import { upload } from '../middleware/Multer.js';

import {
    AddAdmin,
    LoginUser,
    RegisterUser,
    ChangePassword,
    EditAdmin,
    EditProfile,
    GetAllUsers,
    RemoveProfilePicture,
    GetUserProfile,
    VerifyOTP,
    DeleteAdmin,
    ForgotPassword
} from '../controller/User/index.js';

const UserRouter = express.Router();
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'
import { AdminMiddleware } from '../middleware/AdminMiddleware.js';

UserRouter.post('/add-admin', AdminMiddleware, upload.single('profilePhoto'), AddAdmin)
UserRouter.post('/login',LoginUser)
UserRouter.post('/register', upload.single('profilePhoto'), RegisterUser)
UserRouter.post('/change-password', AuthMiddleware, ChangePassword)
UserRouter.post('/edit-admin/:adminId', AdminMiddleware, upload.single('profilePhoto'), EditAdmin)
UserRouter.post('/edit-profile/:userId', AuthMiddleware, upload.single('profilePhoto'), EditProfile)
UserRouter.get('/get-all-users', AdminMiddleware, GetAllUsers)
UserRouter.post('/remove-profile-picture/:userId', AuthMiddleware, RemoveProfilePicture)
UserRouter.get('/get-user-profile', AuthMiddleware, GetUserProfile)
UserRouter.post('/verify-otp', VerifyOTP)
UserRouter.post('/delete-admin/:adminId', AdminMiddleware, DeleteAdmin)
UserRouter.post('/forgot-password', ForgotPassword)

export default UserRouter;