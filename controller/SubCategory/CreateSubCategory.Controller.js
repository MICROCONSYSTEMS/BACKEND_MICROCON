import { SubCategory, Category } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const CreateSubCategory = async (req, res) => {
  try {
    let { name, description, categoryId } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({
        message: 'Name and categoryId are required',
        status: false,
        data: null
      });
    }

    name = name.trim();
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const categoryObjectId = ConvertIntoMongoID(categoryId);

    const existing = await SubCategory.findOne({
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (existing) {
      return res.status(400).json({
        message: 'Subcategory with this name already exists',
        status: false,
        data: null
      });
    }

    const subCategory = await SubCategory.create({
      name,
      description,
      categoryId: categoryObjectId
    });

    return res.status(201).json({
      message: 'Subcategory created successfully',
      status: true,
      data: subCategory
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      status: false,
      data: error.message
    });
  }
};
