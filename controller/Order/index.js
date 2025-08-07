import { GetAllOrders } from "./GetAllOrders.Controller.js";
import { GetUserOrders } from "./GetUserOrder.Controller.js";
import { GetOrderStats } from "./GetOrderStatus.Controller.js";
import { GetOrderDetails } from "./GetOrderDetails.js";
import { UpdateOrderStatus } from "./UpdateOrderStatus.Controller.js";
import { updateBillAndTrackingNumber } from "./UpdateBillAndTrackingNumber.Controller.js";

export{
    GetAllOrders,
    GetUserOrders,
    GetOrderStats,
    GetOrderDetails,
    UpdateOrderStatus,
    updateBillAndTrackingNumber,
}