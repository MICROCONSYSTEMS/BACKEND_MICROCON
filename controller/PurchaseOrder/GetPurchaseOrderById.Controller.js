import { PurchaseOrder } from '../../models/index.js';
import { handleError } from '../../utils/errorHandler.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { GetObjectURL } from '../../utils/GetObject.js';

export const GetPurchaseOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderObjId = ConvertIntoMongoID(orderId);

    const order = await PurchaseOrder.findById(orderObjId).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const signedUrl = await GetObjectURL(`purchase-orders/${order.pdf.fileName}`);
    const orderObj = order.toObject();
    orderObj.pdf.url = signedUrl;

    return res.status(200).json({ order: orderObj });
  } catch (error) {
    handleError(res, error, 'Error fetching purchase order');
  }
};
