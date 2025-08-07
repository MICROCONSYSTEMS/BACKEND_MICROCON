import { AddressBook } from "../../models/index.js";
import { ConvertIntoMongoID } from "../../utils/ConvertIntoMongoID.js";

export const GetAddressById = async (req, res) => {
    try {
      const id = ConvertIntoMongoID(req.params.id);
  
      const address = await AddressBook.findById(id).lean();
  
      if (!address) {
        return res.status(404).json({
          message: 'Address not found',
          status: 'error',
          data: null
        });
      }
  
      return res.status(200).json({
        message: 'Address fetched successfully',
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