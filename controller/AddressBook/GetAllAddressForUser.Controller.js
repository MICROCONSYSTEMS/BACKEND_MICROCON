import { AddressBook } from "../../models/index.js";
import { ConvertIntoMongoID } from "../../utils/ConvertIntoMongoID.js";

export const GetAllAddressesForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { search = '', page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required',
        status: 'error',
        data: null
      });
    }

    const validUserId = ConvertIntoMongoID(userId);
    const currentPage = parseInt(page);
    const pageLimit = parseInt(limit);
    const skip = (currentPage - 1) * pageLimit;

    const searchRegex = new RegExp(search, 'i');

    const filter = {
      userId: validUserId,
      $or: [
        { state: searchRegex },
        { city: searchRegex },
        { postalCode: searchRegex }
      ]
    };

    const totalItems = await AddressBook.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageLimit);

    const addresses = await AddressBook.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit)
      .lean();

    return res.status(200).json({
      message: 'Addresses fetched successfully',
      status: 'success',
      data: addresses,
      pagination:{
        totalItems,
        totalPages,
        currentPage,
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      status: 'error',
      data: error.message
    });
  }
};