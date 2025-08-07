import { PurchaseOrder } from '../../models/index.js';
import { handleError } from '../../utils/errorHandler.js';
import { GetObjectURL } from '../../utils/GetObject.js';

export const GetAllPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find().populate('items.product');

    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        const signedUrl = await GetObjectURL(`purchase-orders/${order.pdf.fileName}`);
        return {
          ...order.toObject(),
          pdf: {
            ...order.pdf,
            url: signedUrl
          }
        };
      })
    );

    return res.status(200).json({ data: updatedOrders });
  } catch (error) {
    handleError(res, error, 'Error fetching purchase orders');
  }
};
