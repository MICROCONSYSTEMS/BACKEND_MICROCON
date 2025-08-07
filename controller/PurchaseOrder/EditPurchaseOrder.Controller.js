import { PurchaseOrder } from '../../models/index.js';
import { handleError } from '../../utils/errorHandler.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { PutObject } from '../../utils/PutObject.js';
import { AdjustStock } from '../../utils/AdjustStock.js';

export const EditPurchaseOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const pdfFile = req.file;
    if (pdfFile) {
    }

    const totalAmount = req.body.totalAmount;

    let updates = req.body;

    const orderObjId = ConvertIntoMongoID(orderId);

    const existingOrder = await PurchaseOrder.findById(orderObjId);

    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!updates.purchaseOrderId?.trim()) {
      return res.status(400).json({ message: 'Purchase Order ID is required' });
    }

    if (!updates.items) {
      return res.status(400).json({ message: 'Items field is required' });
    }

    if (typeof updates.items === 'string') {
      try {
        updates.items = JSON.parse(updates.items);
      } catch {
        return res.status(400).json({ message: 'Invalid items format (not valid JSON)' });
      }
    }

    if (!Array.isArray(updates.items) || updates.items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' });
    }

    updates.items = updates.items.map(item => ({
      ...item,
      product: ConvertIntoMongoID(item.product)
    }));

    if (isNaN(totalAmount) || totalAmount < 0) {
      return res.status(400).json({ message: 'Invalid total amount calculated from items' });
    }

    try {
      await AdjustStock(existingOrder.items, true);
    } catch (adjustErr) {
      return res.status(400).json({ message: adjustErr.message });
    }

    try {
      await AdjustStock(updates.items);
    } catch (adjustErr) {
      return res.status(400).json({ message: adjustErr.message });
    }

    let pdf = existingOrder.pdf;
    if (pdfFile) {
      const fileName = `${Date.now()}-${pdfFile.originalname}`;
      const uploaded = await PutObject({
        folderName: 'purchase-orders',
        fileName,
        fileBuffer: pdfFile.buffer,
        contentType: pdfFile.mimetype,
      });
      pdf = {
        url: uploaded.url,
        fileName: uploaded.filename,
      };
    }

    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
      orderObjId,
      {
        purchaseOrderId: updates.purchaseOrderId,
        items: updates.items,
        totalAmount,
        pdf,
      },
      { new: true }
    );

    res.status(200).json({ message: 'Order updated', order: updatedOrder });

  } catch (error) {
    handleError(res, error, 'Error editing purchase order');
  }
};
