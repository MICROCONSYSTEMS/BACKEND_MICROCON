import { Payment } from "../../models/index.js";

export const GetAllPayments = async (req, res) => {
    try {
      const payments = await Payment.find()
        .populate('userId')
        .populate('orderId');
      return res.status(200).json({ statusCode: 200, message: 'Payments fetched successfully', data: payments });
    } catch (error) {
      return res.status(500).json({ statusCode: 500, message: 'Unable to fetch payments', data: error });
    }
  };