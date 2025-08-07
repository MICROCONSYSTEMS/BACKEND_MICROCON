import express from 'express';
import { 
    CreateSubCategory,
    GetAllSubCategories, 
    GetSubCategoryById, 
    UpdateSubCategory, 
    DeleteSubCategory 
} from '../controller/SubCategory/index.js';
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';
import { AdminMiddleware } from '../middleware/AdminMiddleware.js';

const SubCategoryRouter = express.Router();

SubCategoryRouter.post("/create_subcategory", AdminMiddleware, CreateSubCategory);
SubCategoryRouter.get("/get_subcategories", GetAllSubCategories);
SubCategoryRouter.get("/get_subcategory/:id", AuthMiddleware, GetSubCategoryById);
SubCategoryRouter.delete("/delete_subcategory/:id", AdminMiddleware, DeleteSubCategory);
SubCategoryRouter.put("/update_subcategory/:id", AdminMiddleware, UpdateSubCategory);

export default SubCategoryRouter;
