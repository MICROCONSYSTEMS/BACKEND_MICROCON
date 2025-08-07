import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    images: {
      url: {
        type: String,
        trim: true
      },
      filename: {
        type: String,
        trim: true
      }
    }
  },
  {
    timestamps: true
  }
);

export const Brand = mongoose.model('Brand', brandSchema);
