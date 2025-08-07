import express from 'express'
import {
    AddProduct,
    UpdateProduct,
    GetProductById,
    GetAllProducts,
    AddDiscountToProduct,
    RemoveDiscountFromProduct,
    ChangeProductStatus,
    ToggleFeaturedProduct,
    GetTotalProducts,
} from '../controller/Product/index.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';
import { AdminMiddleware } from '../middleware/AdminMiddleware.js';
import { upload } from '../middleware/Multer.js';

const ProductRouter = express.Router();

ProductRouter.post('/add',upload.any(),AdminMiddleware, AddProduct);
ProductRouter.put('/update/:id',upload.any(),AdminMiddleware, UpdateProduct);
ProductRouter.get('/get-product/:id', GetProductById);
ProductRouter.get('/get-all-products', GetAllProducts);
ProductRouter.put('/add-discount/:id', AdminMiddleware, AddDiscountToProduct);
ProductRouter.delete('/remove-discount/:id', AdminMiddleware, RemoveDiscountFromProduct);
ProductRouter.patch('/change-status/:id', AdminMiddleware, ChangeProductStatus);
ProductRouter.patch('/toggle-featured/:id', AdminMiddleware, ToggleFeaturedProduct);
ProductRouter.get('/get_total', AdminMiddleware, GetTotalProducts);

export default ProductRouter;