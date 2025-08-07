import { Cart } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { GetObjectURL } from '../../utils/GetObject.js';

export const GetCart = async (req, res) => {
  try {
    const userId = ConvertIntoMongoID(req.params.userId);
    let cart = await Cart.findOne({ userId }).populate({
      path: 'products.productId',
      populate: [
        { path: 'brandId' },
        { path: 'categoryId' },
        { path: 'subCategoryId' },
        { path: 'discountId' }
      ],
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Transform products with signed image and manual URLs
    const updatedProducts = await Promise.all(
      cart.products.map(async (item) => {
        const product = item.productId;

        if (!product || typeof product !== 'object') return null;

        const folder =
          product.productType === 'component' ? 'component-files' : 'assembly-files';

        // 🖼️ Generate signed URLs for product images
        const signedImages = await Promise.all(
          (product.images || []).map(async (img) => {
            if (img?.filename) {
              const key = `${folder}/${img.filename}`;
              const url = await GetObjectURL(key);
              return {
                ...img.toObject?.(),
                url,
              };
            }
            return img;
          })
        );

        // 📄 Generate signed URL for manual
        let manual = product.manual;
        if (manual?.filename) {
          const key = `${folder}/${manual.filename}`;
          const url = await GetObjectURL(key);
          manual = { ...manual.toObject?.(), url };
        }

        return {
          productId: product._id,
          quantity: item.quantity,
          product: {
            ...product._doc,
            images: signedImages,
            manual,
          },
        };
      })
    );

    const filteredProducts = updatedProducts.filter(Boolean); // Remove any nulls

    return res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data: {
        userId,
        products: filteredProducts,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};