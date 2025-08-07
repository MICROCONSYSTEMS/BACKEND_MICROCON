import { AddressBook, User } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const AddAddress = async (req, res) => {
  try {
    const {
      userId, street, city, state, postalCode, country
    } = req.body;

    if (!userId || !street || !city || !state || !postalCode || !country) {
      return res.status(400).json({
        message: 'Missing required fields',
        status: 'error',
        data: null
      });
    }

    const validUserId = ConvertIntoMongoID(userId);

    const address = await AddressBook.create({
      userId: validUserId,
      street,
      city,
      state,
      postalCode,
      country
    });

    await User.findByIdAndUpdate(validUserId, {
      $push: { addresses: address._id }
    });

    return res.status(201).json({
      message: 'Address added successfully',
      status: 'success',
      data: address
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      status: 'error',
      data: error.message
    });
  }
};

