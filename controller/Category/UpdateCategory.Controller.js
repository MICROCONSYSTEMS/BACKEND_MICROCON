import { Category } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const UpdateCategory = async (req, res) => {
  try {
    const id = ConvertIntoMongoID(req.params.id);
    let { name, description } = req.body;
    name = name.trim();
    name = name.charAt(0).toUpperCase() + name.slice(1);

    if (!name) {
      return res.status(400).json({
        message: 'Name is required',
        status: false,
        data: null
      });
    }

     const existing = await Category.findOne({
      _id: { $ne: id }, 
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (existing) {
      return res.status(400).json({
        message: 'Another category with this name already exists',
        status: false,
        data: null
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
        status: false,
        data: null
      });
    }

    return res.status(200).json({
      message: 'Category updated successfully',
      status: true,
      data: category
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      status: false,
      data: error.message
    });
  }
};
