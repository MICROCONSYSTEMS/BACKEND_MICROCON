import { GlobalConfig } from '../../models/index.js';

export const createOrUpdateGlobalConfig = async (req, res) => {
  try {
    const { cgstRate, sgstRate, deliveryFee, igstRate } = req.body;

    const updateFields = {};
    if (cgstRate !== undefined) updateFields.cgstRate = cgstRate;
    if (sgstRate !== undefined) updateFields.sgstRate = sgstRate;
    if (igstRate !== undefined) updateFields.igstRate = igstRate;
    if (deliveryFee !== undefined) updateFields.deliveryFee = deliveryFee;

    const config = await GlobalConfig.findOneAndUpdate(
      {}, // only one document
      { $set: updateFields },
      { new: true, upsert: true }
    ).select("cgstRate deliveryFee sgstRate updatedAt igstRate");

    res.status(200).json({
      message: 'Global config saved successfully',
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to save global config',
      error: error.message,
    });
  }
};
