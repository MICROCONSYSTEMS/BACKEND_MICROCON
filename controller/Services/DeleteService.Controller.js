import { Service } from "../../models/index.js";
import {DeleteObject} from '../../utils/DeleteObject.js';
import {ConvertIntoMongoID} from '../../utils/ConvertIntoMongoID.js';

export const DeleteService = async (req, res) => {
    try {
      const id = ConvertIntoMongoID(req.params.id);
      const service = await Service.findById(id);
  
      if (!service) return res.status(404).json({ error: "Service not found" });
  
      await DeleteObject(service.image.fileName);
      await Service.findByIdAndDelete(id);
  
      res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to delete service" });
    }
  };