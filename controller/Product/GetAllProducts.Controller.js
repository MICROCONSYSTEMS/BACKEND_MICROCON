import { Product,Feedback } from '../../models/index.js';
import { handleError } from '../../utils/errorHandler.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { GetObjectURL } from '../../utils/GetObject.js';

export const GetAllProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 5, 1);
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const {
      categoryId,
      subCategoryId,
      brandId,
      status,
      productType,
      featured,
      stock,
      belowReorder
    } = req.query;

    const filter = {};

    if (status === 'false') {
      filter.status = false;
    } else if (status === 'true') {
      filter.status = true;
    }

    if (productType === 'component' || productType === 'assembly') {
      filter.productType = productType;
    }

    if (featured === 'true') {
      filter.featured = true;
    } else if (featured === 'false') {
      filter.featured = false;
    }

    const searchRegex = new RegExp(search, 'i');

    if (search) {
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { sku: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    if (categoryId) filter.categoryId = ConvertIntoMongoID(categoryId);
    if (subCategoryId) filter.subCategoryId = ConvertIntoMongoID(subCategoryId);
    if (brandId) filter.brandId = ConvertIntoMongoID(brandId);

    const filterClauses = [filter];

    if (stock === '0') {
      filterClauses.push({ stock: 0 });
    }

    if (belowReorder === 'true') {
      filterClauses.push({ $expr: { $lt: ['$stock', '$reorderLevel'] } });
    }

    let finalFilter = {};

    if (filterClauses.length > 1) {
      finalFilter = { $and: filterClauses };
    } else {
      finalFilter = filter;
    }

    if (filter.$or && filterClauses.length > 1) {
      finalFilter.$and = [
        ...(finalFilter.$and || []),
        { $or: filter.$or }
      ];
      delete finalFilter.$or;
    }


    const totalItems = await Product.countDocuments(finalFilter);

    let products = await Product.find(finalFilter)
      .populate('categoryId subCategoryId brandId')
      .populate({
        path: 'discountId',
        match: { isActive: true },
      })
      .populate({
        path: 'components',
        select: 'name product_number',
        match: { status: true },
      })
      .skip(skip)
      .limit(limit)
      .lean();


    // 👉 Convert image URLs using GetObjectUrl
    for (const product of products) {
      const folderName =
        product.productType === 'component' ? 'component-files' : 'assembly-files';

      // Signed image URLs
      if (product.images?.length > 0) {
        product.images = await Promise.all(
          product.images.map(async (img) => {
            if (img?.filename) {
              const key = `${folderName}/${img.filename}`;
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

      if (product.manual?.filename) {
        const key = `${folderName}/${product.manual.filename}`;
        const signedUrl = await GetObjectURL(key);
        product.manual.url = signedUrl;
      }

      if (product.productType === 'assembly' && Array.isArray(product.components)) {
        const activeCount = await Product.countDocuments({
          _id: { $in: product.components },
          status: true
        });
        product.componentCount = activeCount;
      }

      // 👉 Calculate average rating
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

    }


    // Manual sorting for populated fields
    if (sortField === 'categoryId.name') {
      products.sort((a, b) =>
        (a.categoryId?.name || '').localeCompare(b.categoryId?.name || '') * sortOrder
      );
    } else if (sortField === 'subCategoryId.name') {
      products.sort((a, b) =>
        (a.subCategoryId?.name || '').localeCompare(b.subCategoryId?.name || '') * sortOrder
      );
    } else {
      products.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * sortOrder;
        return String(aVal || '').localeCompare(String(bVal || '')) * sortOrder;
      });
    }

    // Attach signed URLs to images
    for (const product of products) {
      if (Array.isArray(product.images)) {
        for (const image of product.images) {
          if (image.filename) {
            const key = `product-images/${image.filename}`;
            image.url = await GetObjectURL(key);
          }
        }
      }
    }

    return res.status(200).json({
      message: 'Products fetched successfully.',
      status: true,
      data: products,
      pagination: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

