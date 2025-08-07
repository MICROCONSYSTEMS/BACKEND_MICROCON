import { PurchaseOrder } from '../../models/index.js';
import { handleError } from '../../utils/errorHandler.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { AdjustStock } from '../../utils/AdjustStock.js';
import { DeleteObject } from '../../utils/DeleteObject.js';

export const DeletePurchaseOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderObjId = ConvertIntoMongoID(orderId);

    const order = await PurchaseOrder.findByIdAndDelete(orderObjId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    try {
      await AdjustStock(order.items, true);
    } catch (adjustErr) {
      return res.status(400).json({ message: adjustErr.message });
    }

    const key = `purchase-orders/${order.pdf.filename}`;
    const deleteResult = await DeleteObject(key);

    if (!deleteResult.success) {
      console.warn(`S3 Deletion Warning: ${deleteResult.message}`);
    }

    res.status(200).json({ message: 'Order deleted successfully', s3: deleteResult });
  } catch (error) {
    handleError(res, error, 'Error deleting purchase order');
  }
};
