import { Payment, Order, Product } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import RazorPayInstance from '../../config/RazorPay.js';
import { AdjustStock } from '../../utils/AdjustStock.js'; 
import { generateOrderNumber } from '../../utils/generateOrderNumber.js';
dotenv.config();

export const verifyAndCreatePaymentOrder = async (req, res) => {
  try {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Fetch payment method from Razorpay
    const paymentDetail = await RazorPayInstance.payments.fetch(razorpay_payment_id);

    const paymentMethod = paymentDetail.method;

    const { orderData } = req.query;
    if (!orderData) {
      return res.status(400).json({ statusCode: 400, message: 'Order data not provided' });
    }

    const parsedOrderData = JSON.parse(orderData);

    // Signature validation
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ statusCode: 400, message: 'Invalid signature', data: null });
    }

    // ✅ Adjust stock
    const stockAdjustmentItems = parsedOrderData.products.map(p => ({
      product: p.productId,
      quantity: p.quantity
    }));

    await AdjustStock(stockAdjustmentItems);

    // Create payment
    const payment = await Payment.create({
      userId: ConvertIntoMongoID(parsedOrderData.userId),
      orderId: null, // will link below
      paymentMethod,
      paymentStatus: 'completed',
      transactionId: razorpay_payment_id
    });

    const orderNumber = await generateOrderNumber();

    // Create order
    const order = await Order.create({
      ...parsedOrderData,
      userId: ConvertIntoMongoID(parsedOrderData.userId),
      paymentId: payment._id,
      orderNumber,
    });

    // Link order to payment
    payment.orderId = order._id;
    await payment.save();

    // Populate order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('userId')
      .populate('products.productId')
      .populate('products.discountId')
      .populate('deliveryAddressId')
      .populate('paymentId')
      .populate('overallDiscountId');

    console.log("📋 Final populated order:", populatedOrder);

    const populatedPayment = await Payment.findById(payment._id)
      .populate('userId')
      .populate('orderId');

    console.log("📋 Final populated payment:", populatedPayment);

    // Redirect to frontend success page
    return res.redirect(`http://localhost:5173/paymentSuccess?reference=${razorpay_payment_id}`);
  } catch (error) {
    console.error("❌ Error in verifyAndCreatePaymentOrder:", error);
    return res.redirect(
      `http://localhost:5173/paymentFailed?message=${encodeURIComponent(error.message)}`
    );
  }
};
