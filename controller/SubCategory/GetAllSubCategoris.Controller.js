import { SubCategory } from '../../models/index.js';
import {ConvertIntoMongoID} from '../../utils/ConvertIntoMongoID.js'

export const GetAllSubCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      order = 'desc',
      categoryId = ''
    } = req.query;

    const pageNumber = Math.max(parseInt(page), 1);
    const pageSize = Math.max(parseInt(limit), 1);
    const sortOrder = order === 'asc' ? 1 : -1;

    const query = {};

     if (categoryId) {
      query.categoryId = ConvertIntoMongoID(categoryId);
    }

    if (search) {
      const regex = new RegExp(search.replace(/['"]+/g, '').trim(), 'i');
      query.$or = [
        { name: regex },
        { description: regex }
      ];
    }

    const totalItems = await SubCategory.countDocuments(query);

    const subcategories = await SubCategory.find(query)
      .populate('categoryId', 'name')
      .sort({ [sortBy]: sortOrder })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({
      message: 'Subcategories fetched successfully',
      status: true,
      data: subcategories,
      pagination: {
        totalItems,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalItems / pageSize)
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      status: false,
      data: error.message
    });
  }
};
