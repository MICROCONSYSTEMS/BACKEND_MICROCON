import { Product, Feedback } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { handleError } from '../../utils/errorHandler.js';
import { GetObjectURL } from '../../utils/GetObject.js';

export const GetProductById = async (req, res) => {
  try {
    const productId = ConvertIntoMongoID(req.params.id);

    const product = await Product.findOne({
      _id: productId,
      status: true
    }).populate('categoryId subCategoryId brandId')
      .populate({
        path: 'discountId',
        match: { isActive: true },
      });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.', status: false });
    }

    const folderName =
      product.productType === 'component' ? 'component-files' : 'assembly-files';

    // 🔁 Signed URLs for product images
    if (product.images?.length > 0) {
      product.images = await Promise.all(
        product.images.map(async (img) => {
          if (img?.filename) {
            const key = `${folderName}/${img.filename}`;
            const signedUrl = await GetObjectURL(key);
            return {
              ...img.toObject?.(), // keep full object
              url: signedUrl
            };
          }
          return img;
        })
      );
    }

    // 📘 Signed URL for manual
    let manualURL = '';
    if (product.manual?.filename) {
      const key = `${folderName}/${product.manual.filename}`;
      manualURL = await GetObjectURL(key);
    }

    // 🧩 Get and enrich components (status: true only)
    let componentDetails = [];
    if (product.components?.length > 0) {
      componentDetails = await Product.find({
        _id: { $in: product.components },
        status: true
      });

      for (const component of componentDetails) {
        const compFolder =
          component.productType === 'component' ? 'component-files' : 'assembly-files';

        if (component.images?.length > 0) {
          component.images = await Promise.all(
            component.images.map(async (img) => {
              if (img?.filename) {
                const key = `${compFolder}/${img.filename}`;
                const signedUrl = await GetObjectURL(key);
                return {
                  ...img.toObject?.(),
                  url: signedUrl
                };
              }
              return img;
            })
          );
        }
      }
    }
    const feedbackStats = await Feedback.aggregate([
      { $match: { product_id: product._id } },
      {
        $group: {
          _id: '$product_id',
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    product.averageRating = feedbackStats[0]?.avgRating || 0;
    console.log(product)

    res.status(200).json({
      message: 'Product fetched successfully.',
      status: true,
      data: {
        ...product.toObject(),
        averageRating: feedbackStats[0]?.avgRating || 0,
        manual: {
          ...product.manual,
          url: manualURL || product.manual?.url || ''
        },
        components: componentDetails
      }
    });

  } catch (error) {
    handleError(res, error);
  }
};
