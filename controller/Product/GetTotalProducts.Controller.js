import { Product } from "../../models/index.js";

export const GetTotalProducts = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ status: true });

    return res.status(200).json({
      message: 'Total active products fetched successfully',
      status: true,
      data: { totalProducts },
    });
  } catch (error) {
    console.error('Error fetching total products:', error.message);
    return res.status(500).json({
      message: 'Something went wrong while fetching product count',
      status: false,
      data: null,
    });
  }
};
