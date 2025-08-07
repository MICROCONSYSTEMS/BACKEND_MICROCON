import { AddressBook, User } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const DeleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const validId = ConvertIntoMongoID(id);

    const address = await AddressBook.findById(validId);
    if (!address) {
      return res.status(404).json({
        message: 'Address not found',
        status: 'error',
        data: null
      });
    }

    await User.findByIdAndUpdate(address.userId, {
      $pull: { addresses: address._id }
    });

    await AddressBook.findByIdAndDelete(validId);

    return res.status(200).json({
      message: 'Address deleted successfully',
      status: 'success',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      status: 'error',
      data: error.message
    });
  }
};