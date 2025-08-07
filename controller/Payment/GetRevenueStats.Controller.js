import { Order } from "../../models/index.js";

export const GetRevenueStats = async (req, res) => {
    try {
        const revenue = await Order.aggregate([
            {
                $match: {
                    status: 'confirmed'
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: '$totalAmount'
                    }
                }
            }
        ]);
        return res.status(200).json({
            statusCode: 200,
            message: 'Revenue stats fetched successfully',
            data: revenue[0]?.total || 0
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Failed to fetch revenue stats',
            data: error
        });
    }
};