import { Order } from '../../models/index.js';
import { PutObject } from '../../utils/PutObject.js';
import { DeleteObject } from '../../utils/DeleteObject.js';

export const updateBillAndTrackingNumber = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber } = req.body;
    const file = req.file;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if file is provided
    let updatedBill = order.bill;

    if (file) {
      const newFileName = file.originalname;

      // Delete old bill if filename changed
      if (order.bill?.fileName && order.bill.fileName !== newFileName) {
        const oldKey = `bills/${order.bill.fileName}`;
        await DeleteObject(oldKey);
      }

      // Upload new file
      const uploadResult = await PutObject({
        folderName: 'bills',
        fileName: newFileName,
        fileBuffer: file.buffer,
        contentType: file.mimetype
      });

      updatedBill = {
        fileName: uploadResult.filename,
        url: uploadResult.url
      };
    }

    // Update order
    order.bill = updatedBill;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    return res.status(200).json({
      message: 'Order updated successfully',
      data: order
    });
  } catch (err) {
    console.error("❌ Error updating order:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
