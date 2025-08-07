import { Category } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const CreateCategory = async (req, res) => {
  try {
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
      name: { $regex: `^${name}$`, $options: "i" }
    });
    if (existing) {
      return res.status(400).json({
        message: 'Category with this name already exists',
        status: false,
        data: null
      });
    }

    const category = await Category.create({ name, description });
    return res.status(201).json({
      message: 'Category created successfully',
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