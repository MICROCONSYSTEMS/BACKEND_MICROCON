import { AddressBook } from '../../models/index.js';
import {ConvertIntoMongoID} from '../../utils/ConvertIntoMongoID.js';

export const EditAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const validId = ConvertIntoMongoID(id);

    const updated = await AddressBook.findByIdAndUpdate(validId, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({
        message: 'Address not found',
        status: 'error',
        data: null
      });
    }

    return res.status(200).json({
      message: 'Address updated successfully',
      status: 'success',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      status: 'error',
      data: error.message
    });
  }
};
