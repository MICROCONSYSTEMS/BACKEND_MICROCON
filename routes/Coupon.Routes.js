import express from 'express';
import {
   CreateCoupon,
   EditCoupon,
   DeleteCoupon,
   GetAllCoupons,
   GetCouponById,
} from '../controller/Discount/index.js';
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';
import { AdminMiddleware } from '../middleware/AdminMiddleware.js';

const CouponRouter = express.Router();

CouponRouter.post('/create-coupon', AdminMiddleware, CreateCoupon);
CouponRouter.put('/edit-coupon/:couponId', AdminMiddleware, EditCoupon);
CouponRouter.delete('/delete-coupon/:couponId', AdminMiddleware, DeleteCoupon);
CouponRouter.get('/get-all-coupons', AuthMiddleware, GetAllCoupons);
CouponRouter.get('/get-coupon/:couponId', AuthMiddleware, GetCouponById);

export default CouponRouter;
