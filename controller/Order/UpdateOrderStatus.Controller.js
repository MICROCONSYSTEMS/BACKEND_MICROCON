import { Order } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { SendEmail } from '../../utils/SendMails.js';

export const UpdateOrderStatus = async (req, res) => {
  try {
    const orderId = ConvertIntoMongoID(req.params.orderId);
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'dispatched', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        statusCode: 400,
        message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
        data: null,
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('userId', 'email')
      .populate('products.productId', 'name');

    if (!updatedOrder) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Order not found',
        data: null,
      });
    }

    const customerEmail = updatedOrder?.userId?.email;
    // Send email to the customer
    if (customerEmail) {
      const itemListHtml = updatedOrder.products.map(item => {
        const name = item.productId?.name || 'Unnamed Product';
        return `<li>${name} — Qty: ${item.quantity}</li>`;
      }).join('');

      await SendEmail({
        to: customerEmail,
        subject: `Your Order #${updatedOrder._id} Status: ${status.toUpperCase()}`,
        html: `
      <p>Dear Customer,</p>
      <p>We would like to inform you that your order <strong>#${updatedOrder._id}</strong> has been: <strong>${status.toUpperCase()}</strong></p>
      
      <h4>Order Summary:</h4>
      <ul>
        ${itemListHtml}
      </ul>

      <p>If you have any questions or concerns, feel free to reach out to our support team.</p>
      <p>Thank you for choosing Microcon Systems!</p>
      <p>—Microcon Systems</p>
    `
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Order status updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Failed to update order status',
      data: error.message || error,
    });
  }
};
