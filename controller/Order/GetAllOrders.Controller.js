import { Order, User } from "../../models/index.js";
import { ConvertIntoMongoID } from "../../utils/ConvertIntoMongoID.js";
import { GetObjectURL } from "../../utils/GetObject.js";

export const GetAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;

    const query = {};

    // ✅ Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // ✅ If search term is a valid ObjectId → search by order ID
    if (search && /^[0-9a-fA-F]{24}$/.test(search)) {
      query._id = ConvertIntoMongoID(search);
    }

    // ✅ Fetch orders
    let orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('userId')
      .populate('products.productId')
      .populate('products.discountId')
      .populate('deliveryAddressId')
      .populate('paymentId')
      .populate('overallDiscountId');

    // ✅ If name-based search, filter manually
    if (search && !query._id) {
      const searchRegex = new RegExp(search, 'i');
      orders = orders.filter(order => {
        const fullName = `${order.userId?.firstName || ''} ${order.userId?.lastName || ''}`.trim();
        return searchRegex.test(fullName);
      });
    }

    await Promise.all(
      orders.map(async (order) => {
        if (order.bill?.fileName) {
          const key = `bills/${order.bill.fileName}`;
          const signedUrl = await GetObjectURL(key);
          order.bill.url = signedUrl;
        }
      })
    );

    return res.status(200).json({
      statusCode: 200,
      message: 'Orders fetched successfully',
      data: orders
    });

  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: 'Unable to fetch orders',
      data: error.message || error
    });
  }
};
