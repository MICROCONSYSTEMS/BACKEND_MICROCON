import express from 'express';
import {
    CreateCategory,
    GetAllCategories,
    GetCategoryById,
    UpdateCategory,
    DeleteCategory
} from '../controller/Category/index.js';
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';
import { AdminMiddleware } from '../middleware/AdminMiddleware.js'


const CategoryRouter = express.Router();

CategoryRouter.post("/create_category", AdminMiddleware, CreateCategory);
CategoryRouter.get("/get_categories", GetAllCategories);
CategoryRouter.get("/get_category/:id", AuthMiddleware, GetCategoryById);
CategoryRouter.delete("/delete_category/:id", AdminMiddleware, DeleteCategory);
CategoryRouter.put("/update_category/:id", AdminMiddleware, UpdateCategory);

export default CategoryRouter;
