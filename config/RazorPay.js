import dotenv from "dotenv";
import Razorpay from "razorpay";
dotenv.config();

var RazorPayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default RazorPayInstance;
