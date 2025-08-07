import { Category } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const GetCategoryById = async (req, res) => {
  try {
    const id = ConvertIntoMongoID(req.params.id);

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
        status: false,
        data: null
      });
    }

    return res.status(200).json({
      message: 'Category fetched successfully',
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