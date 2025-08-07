import express from 'express'
import {
    AddToCart,
    ClearCart,
    GetCart,
    RemoveFromCart,
    UpdateCart,
} from '../controller/Cart/index.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';

const CartRouter = express.Router();

CartRouter.get('/:userId', AuthMiddleware, GetCart);
CartRouter.post('/:userId/add', AuthMiddleware, AddToCart);
CartRouter.put('/:userId/update', AuthMiddleware, UpdateCart);
CartRouter.delete('/:userId/remove/:productId', AuthMiddleware, RemoveFromCart);
CartRouter.delete('/:userId/clear', AuthMiddleware, ClearCart);

export default CartRouter;