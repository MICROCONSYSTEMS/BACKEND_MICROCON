import mongoose from 'mongoose';

const GlobalConfigSchema = new mongoose.Schema({
  cgstRate: {
    type: Number,
    required: true,
    default: 9,
    min: 0,
    max: 100,
  },
  sgstRate: {
    type: Number,
    required: true,
    default: 9,
    min: 0,
    max: 100,
  },
  igstRate: {
    type: Number,
    required: true,
    default: 9,
    min: 0,
    max: 100,
  },
  deliveryFee: {
    type: Number,
    required: true,
    default: 2,
    min: 0,
  },
}, { timestamps: true });

export const GlobalConfig = mongoose.model('GlobalConfig', GlobalConfigSchema);
