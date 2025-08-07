import { Product } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { PutObject } from '../../utils/PutObject.js';
import { handleError } from '../../utils/errorHandler.js';

export const AddProduct = async (req, res) => {
  try {
    const {
      name, product_number, productType, description,
      price, categoryId, subCategoryId, brandId,
      stock, reorderLevel, components = []
    } = req.body;

    if (!name || !price || !categoryId || !productType) {
      return res.status(400).json({
        message: 'Name, price, categoryId, and productType are required.',
        status: false
      });
    }

    const productData = {
      name,
      product_number,
      productType,
      description,
      price,
      categoryId: ConvertIntoMongoID(categoryId),
      subCategoryId: subCategoryId ? ConvertIntoMongoID(subCategoryId) : undefined,
      brandId: brandId ? ConvertIntoMongoID(brandId) : undefined,
      stock: stock || 0,
      reorderLevel: reorderLevel || 0,
      images: [],
      manual: {},
      components: components.map(id => ConvertIntoMongoID(id))
    };

    if (req.files?.length > 0) {
      for (const file of req.files) {
        const uploadResult = await PutObject({
          folderName: productType === 'component' ? 'component-files' : 'assembly-files',
          fileName: `${Date.now()}_${file.originalname}`,
          fileBuffer: file.buffer,
          contentType: file.mimetype
        });

        if (file.fieldname === 'manual') {
          productData.manual = {
            url: uploadResult.url,
            filename: uploadResult.filename
          };
        } else {
          productData.images.push({
            url: uploadResult.url,
            filename: uploadResult.filename
          });
        }
      }
    }

    const newProduct = await Product.create(productData);
    res.status(201).json({
      message: 'Product added successfully.',
      status: true,
      data: newProduct
    });

  } catch (error) {
    handleError(res, error);
  }
};
