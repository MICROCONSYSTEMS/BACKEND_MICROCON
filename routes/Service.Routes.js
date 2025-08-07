import express from "express";
import {
    GetAllServices,
    CreateService,
    UpdateService,
    DeleteService
} from "../controller/Services/index.js";
import { AdminMiddleware } from "../middleware/AdminMiddleware.js";
import { upload } from "../middleware/Multer.js";

const ServiceRouter = express.Router();

ServiceRouter.get('/get-all-services', GetAllServices);
ServiceRouter.post('/create-service', upload.single('file'), CreateService);
ServiceRouter.put('/update-service/:id', upload.single('file'), AdminMiddleware, UpdateService);
ServiceRouter.delete('/delete-service/:id', AdminMiddleware, DeleteService);

export default ServiceRouter;
