import express from 'express';
import{
    GetAllOrders,
    GetOrderDetails,
    GetOrderStats,
    GetUserOrders,
    UpdateOrderStatus,
    updateBillAndTrackingNumber,
} from '../controller/Order/index.js';
import { upload } from "../middleware/Multer.js";

const OrderRouter = express.Router();

OrderRouter.get('/get-all-order',GetAllOrders);
OrderRouter.get('/get-user-order/:userId',GetUserOrders);
OrderRouter.get('/get-order-stats',GetOrderStats);
OrderRouter.get('/get-order-details/:orderId',GetOrderDetails);
OrderRouter.put('/update-order-status/:orderId',UpdateOrderStatus);
OrderRouter.put('/update-bill-and-tracking-number/:orderId',upload.single("bill"),updateBillAndTrackingNumber);

export default OrderRouter;

