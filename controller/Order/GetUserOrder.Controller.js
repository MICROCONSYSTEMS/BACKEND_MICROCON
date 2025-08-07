import { Order } from "../../models/index.js";
import { ConvertIntoMongoID } from "../../utils/ConvertIntoMongoID.js";
import { GetObjectURL } from "../../utils/GetObject.js";

export const GetUserOrders = async (req, res) => {
  try {
    const userId = ConvertIntoMongoID(req.params.userId);

    const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
      .populate("products.productId")
      .populate("products.discountId")
      .populate("deliveryAddressId")
      .populate("paymentId")
      .populate("overallDiscountId")
      .lean();

    for (const order of orders) {

      if (order.bill?.fileName) {
        const billKey = `bills/${order.bill.fileName}`;
        const signedBillUrl = await GetObjectURL(billKey);
        order.bill.url = signedBillUrl;
      }

      for (const product of order.products) {
        const productDoc = product?.productId;

        if (productDoc?.images?.length > 0) {
          const folderName =
            productDoc.productType === "component"
              ? "component-files"
              : "assembly-files";

          productDoc.images = await Promise.all(
            productDoc.images.map(async (img) => {
              if (img?.filename) {
                const key = `${folderName}/${img.filename}`;
                const signedUrl = await GetObjectURL(key);
                return {
                  ...img,
                  url: signedUrl,
                };
              }
              return img;
            })
          );
        }
      }
    }

    return res.status(200).json({
      statusCode: 200,
      message: "User orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Unable to fetch user orders",
      data: error.message || error,
    });
  }
};