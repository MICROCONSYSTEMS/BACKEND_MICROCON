import express from "express";
import {
    CreatePurchaseOrder,
    GetPurchaseOrderById,
    GetAllPurchaseOrders,
    EditPurchaseOrder,
    DeletePurchaseOrder,
    GetPurchaseOrderPDF
} from "../controller/PurchaseOrder/index.js";
import { upload } from "../middleware/Multer.js";
import { AdminMiddleware } from "../middleware/AdminMiddleware.js";
const PurchaseOrderRouter = express.Router();

PurchaseOrderRouter.post("/create-purchase-order",AdminMiddleware, upload.single("purchaseOrderFile"),CreatePurchaseOrder);
PurchaseOrderRouter.get("/get-all-purchase-orders", AdminMiddleware, GetAllPurchaseOrders);
PurchaseOrderRouter.get("/get-purchase-order/:orderId", AdminMiddleware, GetPurchaseOrderById);
PurchaseOrderRouter.put("/update-purchase-order/:orderId",AdminMiddleware, upload.single("purchaseOrderFile"), EditPurchaseOrder);
PurchaseOrderRouter.delete("/delete-purchase-order/:orderId", AdminMiddleware, DeletePurchaseOrder);
PurchaseOrderRouter.get("/purchase-order-pdf/:key", AdminMiddleware, GetPurchaseOrderPDF);

export default PurchaseOrderRouter;