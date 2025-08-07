import { Category } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const GetAllCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const pageNumber = Math.max(parseInt(page), 1);
    const pageSize = Math.max(parseInt(limit), 1);
    const sortOrder = order === 'asc' ? 1 : -1;

    const query = {};

    if (search) {
      const regex = new RegExp(search, 'i'); 
      query.$or = [
        { name: regex },
        { description: regex }
      ];
    }

    const total = await Category.countDocuments(query);

    const categories = await Category.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({
      message: 'Categories fetched successfully',
      status: true,
      data: categories,
      pagination:{
        totalItems:total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / pageSize)
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
