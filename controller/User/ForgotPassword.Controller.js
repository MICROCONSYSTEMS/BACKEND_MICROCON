import crypto from 'crypto'
import { User } from '../../models/index.js';
import { SendEmail } from '../../utils/SendMails.js';

export const ForgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found." });
  
      // Generate 6-digit OTP as string
      const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  
      // Hash OTP for security
      const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  
      // Save hashed OTP and expiry time on user document
      user.passwordResetToken = otpHash;
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expires in 10 mins
      await user.save();
  
      // Send OTP email (adjust as per your sendEmail utility)
      await SendEmail({
        to: user.email,
        subject: 'Your Password Reset OTP',
        text: `Your OTP for password reset is ${otp}. It expires in 10 minutes.`
      });
  
      res.json({ message: "OTP sent to your email." });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  