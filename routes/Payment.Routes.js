import express from 'express';
import { 
    ProcessPaymentController,
    GetRazorPayKeyController,
    verifyAndCreatePaymentOrder,
    GetAllPayments,
    GetRevenueStats,
 } from '../controller/Payment/index.js';

const PaymentRouter = express.Router();

PaymentRouter.post('/process', ProcessPaymentController);
PaymentRouter.get('/razorpay-key', GetRazorPayKeyController);
PaymentRouter.post('/verify-and-create-payment-order', verifyAndCreatePaymentOrder);
PaymentRouter.get('/get-all-payments',GetAllPayments);
PaymentRouter.get('get-revenue-stats',GetRevenueStats);

export default PaymentRouter;
