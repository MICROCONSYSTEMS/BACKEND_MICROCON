import { GlobalConfig } from "../../models/index.js";

export const GetGlobalConfig = async (req, res) => {
    try {
      const config = await GlobalConfig.findOne().select("cgstRate deliveryFee sgstRate updatedAt igstRate");
  
      if (!config) {
        return res.status(404).json({ message: 'No global config found' });
      }
  
      res.status(200).json({
        message: 'Global config fetched successfully',
        data: config,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching config',
        error: error.message,
      });
    }
  };
  