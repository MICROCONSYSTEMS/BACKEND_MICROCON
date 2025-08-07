import mongoose from 'mongoose';

const backInStockSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  notified: {
    type: Boolean,
    default: false
  },
},{timestamps:true});

export const NotifyUser = mongoose.model('BackInStockRequest', backInStockSchema);
