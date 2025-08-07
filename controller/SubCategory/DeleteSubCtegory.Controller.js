import { SubCategory } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const DeleteSubCategory = async (req, res) => {
  try {
    const id = ConvertIntoMongoID(req.params.id);

    const deleted = await SubCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Subcategory not found',
        status: false,
        data: null
      });
    }

    return res.status(200).json({
      message: 'Subcategory deleted successfully',
      status: true,
      data: deleted
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      status: false,
      data: error.message
    });
  }
};
