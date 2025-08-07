import { Order } from "../../models/index.js";

export const GetOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    return res.status(200).json({
      statusCode: 200,
      message: 'Order stats fetched successfully',
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: 'Failed to fetch order stats',
      data: error
    });
  }
};