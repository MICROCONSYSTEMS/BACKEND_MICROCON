import { User } from "../../models/index.js";
import crypto from 'crypto'
import bcrypt from "bcryptjs";

export const VerifyOTP = async (req, res) => {
    try {
      const { email, otp, newPassword, confirmPassword } = req.body;
  
      if (!email || !otp || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirm password do not match." });
      }
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found." });
  
      if (!user.passwordResetToken || !user.passwordResetExpires) {
        return res.status(400).json({ message: "No OTP request found. Please request a new OTP." });
      }
  
      if (user.passwordResetExpires < Date.now()) {
        return res.status(400).json({ message: "OTP expired. Please request a new OTP." });
      }
  
      const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
      if (otpHash !== user.passwordResetToken) {
        return res.status(400).json({ message: "Invalid OTP." });
      }
  
      // OTP verified - update password and clear reset token fields
      user.password = await bcrypt.hash(newPassword, 10);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
  
      res.json({ message: "Password reset successful." });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };