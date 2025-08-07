import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    //  required: true
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'netbanking', 'upi', 'wallet', 'cod'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      required: true
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    transactionId: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
