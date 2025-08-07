import express from 'express';
import { upload, uploadErrorHandler } from '../middleware/Multer.js';
import {
    CreateBrand,
    DeleteBrand,
    GetBrandById,
    GetBrands,
    UpdateBrand,
} from '../controller/Brand/index.js';
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';
import { AdminMiddleware } from '../middleware/AdminMiddleware.js'

const BrandRouter = express.Router();

BrandRouter.post("/create_brand", AdminMiddleware, upload.single('file'), uploadErrorHandler, CreateBrand);
BrandRouter.get("/get_brands", GetBrands);
BrandRouter.get("/get_brand/:id", AuthMiddleware, GetBrandById);
BrandRouter.delete("/delete_brand/:id", AdminMiddleware, DeleteBrand);
BrandRouter.put("/update_brand/:id", AdminMiddleware, upload.single("file"), UpdateBrand);

export default BrandRouter;
