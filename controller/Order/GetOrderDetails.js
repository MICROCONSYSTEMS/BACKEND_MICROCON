import { Order } from '../../models/index.js';
import { GetObjectURL } from '../../utils/GetObject.js';

export const GetOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('userId', 'firstName lastName email')
      .populate('products.productId', 'name images productType')
      .populate('products.discountId', 'code discountType discountValue')
      .populate('deliveryAddressId')
      .populate('paymentId')
      .populate('overallDiscountId', 'code discountType discountValue')
      .lean(); // allow modification

    if (!order) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Order not found',
        data: null
      });
    }

    if (order.bill?.fileName) {
      const billKey = `bills/${order.bill.fileName}`;
      const signedBillUrl = await GetObjectURL(billKey);
      order.bill.url = signedBillUrl;
    }

    // Process signed URLs for product images
    for (const product of order.products) {
      const productDoc = product?.productId;

      if (productDoc?.images?.length > 0) {
        const folderName =
          productDoc.productType === 'component' ? 'component-files' : 'assembly-files';

        productDoc.images = await Promise.all(
          productDoc.images.map(async (img) => {
            if (img?.filename) {
              const key = `${folderName}/${img.filename}`;
              const signedUrl = await GetObjectURL(key);
              return {
                ...img,
                url: signedUrl,
              };
            }
            return img;
          })
        );
      }
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Order fetched successfully',
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: 'Failed to fetch order',
      data: error.message
    });
  }
};
