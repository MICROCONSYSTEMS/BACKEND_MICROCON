import { SubCategory } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const UpdateSubCategory = async (req, res) => {
  try {
    const id = ConvertIntoMongoID(req.params.id);
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
      _id: { $ne: id },
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (existing) {
      return res.status(400).json({
        message: 'Another subcategory with this name already exists',
        status: false,
        data: null
      });
    }

    const subcategory = await SubCategory.findByIdAndUpdate(
      id,
      { name, description, categoryId: categoryObjectId },
      { new: true }
    );

    if (!subcategory) {
      return res.status(404).json({
        message: 'Subcategory not found',
        status: false,
        data: null
      });
    }

    return res.status(200).json({
      message: 'Subcategory updated successfully',
      status: true,
      data: subcategory
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      status: false,
      data: error.message
    });
  }
};
