import express from 'express';
import { 
    AddToWishlist,
    ClearWishlist,
    GetWishlist,
    RemoveFromWishlist,
} from "../controller/Wishlist/index.js";
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';

const WishlistRouter = express.Router();

WishlistRouter.post("/add_to_wishlist/:userId/:productId", AuthMiddleware, AddToWishlist);
WishlistRouter.delete("/clear_wishlist/:userId", AuthMiddleware, ClearWishlist);
WishlistRouter.get("/get_wishlist/:userId", AuthMiddleware, GetWishlist);
WishlistRouter.delete("/remove_from_wishlist/:userId/:productId", AuthMiddleware, RemoveFromWishlist);

export default WishlistRouter;
