import { SubCategory } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const GetSubCategoryById = async (req, res) => {
  try {
    const id = ConvertIntoMongoID(req.params.id);

    const subcategory = await SubCategory.findById(id).populate('categoryId', 'name');

    if (!subcategory) {
      return res.status(404).json({
        message: 'Subcategory not found',
        status: false,
        data: null
      });
    }

    return res.status(200).json({
      message: 'Subcategory fetched successfully',
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
