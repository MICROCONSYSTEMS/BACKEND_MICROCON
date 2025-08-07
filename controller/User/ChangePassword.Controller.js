import { User } from "../../models/index.js";
import bcrypt from "bcryptjs";

export const ChangePassword = async (req, res) => {
    try {
      const email = req.user.email;
      const { oldPassword, newPassword, confirmPassword } = req.body;
  
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirm password do not match." });
      }
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found." });
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Old password is incorrect." });
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.json({ message: "Password changed successfully." });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  