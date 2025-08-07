import { Product } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';
import { PutObject } from '../../utils/PutObject.js';
import { handleError } from '../../utils/errorHandler.js';
import { MoveObject } from '../../utils/MoveObject.js'
import { SendEmail } from '../../utils/SendMails.js';
import { NotifyUser } from '../../models/index.js';

export const UpdateProduct = async (req, res) => {
  try {
    const productId = ConvertIntoMongoID(req.params.id);

    const {
      name, product_number, productType, description,
      price, categoryId, subCategoryId, brandId,
      stock, reorderLevel, components = []
    } = req.body;

    console.log(req.body)
    const updateData = {};

    if (name) updateData.name = name;
    if (product_number) updateData.product_number = product_number;
    if (productType) updateData.productType = productType;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (categoryId) updateData.categoryId = ConvertIntoMongoID(categoryId);
    if (subCategoryId) updateData.subCategoryId = ConvertIntoMongoID(subCategoryId);
    if (brandId) updateData.brandId = ConvertIntoMongoID(brandId);
    if (stock !== undefined) updateData.stock = stock;
    if (reorderLevel !== undefined) updateData.reorderLevel = reorderLevel;

    if (components.length > 0) {
      updateData.components = components.map(id => ConvertIntoMongoID(id));
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.', status: false });
    }

    const prevStock = existingProduct.stock ?? 0;

    // Handle uploaded files
    if (req.files?.length > 0) {
      updateData.images = [];
      for (const file of req.files) {
        const uploadResult = await PutObject({
          folderName: productType === 'component' ? 'component-files' : 'assembly-files',
          fileName: `${Date.now()}_${file.originalname}`,
          fileBuffer: file.buffer,
          contentType: file.mimetype
        });

        if (file.fieldname === 'manual') {
          updateData.manual = {
            url: uploadResult.url,
            filename: uploadResult.filename
          };
        } else {
          updateData.images.push({
            url: uploadResult.url,
            filename: uploadResult.filename
          });
        }
      }
    }

    const typeChanged = productType && productType !== existingProduct.productType;

    if (typeChanged) {
      const oldFolder = existingProduct.productType === 'component' ? 'component-files' : 'assembly-files';
      const newFolder = productType === 'component' ? 'component-files' : 'assembly-files';

      if (existingProduct.productType === 'component' && productType === 'assembly') {
        await Product.updateMany(
          { components: productId },
          { $pull: { components: productId } }
        );
      }

      if (existingProduct.manual?.filename) {
        const { newUrl, newFilename } = await MoveObject({
          oldFolder,
          newFolder,
          filename: existingProduct.manual.filename
        });

        updateData.manual = {
          url: newUrl,
          filename: newFilename
        };
      }

      if (Array.isArray(existingProduct.images) && existingProduct.images.length > 0) {
        updateData.images = [];

        for (const image of existingProduct.images) {
          if (image?.filename) {
            const { newUrl, newFilename } = await MoveObject({
              oldFolder,
              newFolder,
              filename: image.filename
            });

            updateData.images.push({
              ...image,
              url: newUrl,
              filename: newFilename
            });
          } else {
            updateData.images.push(image);
          }
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    if (prevStock === 0 && updateData.stock > 0) {
      const notifyUsers = await NotifyUser.find({ productId });

      for (const user of notifyUsers) {
        await SendEmail({
          to: user.email,
          subject: `Back in Stock: ${existingProduct.name}`,
          html: `
            <p>Dear Customer,</p>
            <p>Good news! The product <strong>${existingProduct.name}</strong> you were waiting for is <strong>back in stock</strong>.</p>
    
            <p><a href="http://localhost:5173/products/${existingProduct._id}" target="_blank">Click here to view the product</a></p>
    
            <p>Grab it before it's gone again!</p>
    
            <p>Thank you for choosing Microcon Systems.</p>
            <p>— Microcon Systems</p>
          `
        });
      }

      await NotifyUser.deleteMany({ productId });
    }

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.', status: false });
    }

    res.status(200).json({ message: 'Product updated successfully.', status: true, data: updatedProduct });

  } catch (error) {
    handleError(res, error);
  }
};
