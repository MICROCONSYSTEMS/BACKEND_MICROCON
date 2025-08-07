import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderNumber: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true,
          min: 0
        },
        discountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Coupon'
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'dispatched', 'cancelled','failed'],
      default: 'pending'
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    deliveryAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AddressBook',
      required: true
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    overallDiscountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon'
    },
    bill: {
      url: {
        type: String,
      },
      fileName: {
        type: String,
      }
    },
    trackingNumber: {
      type: String,
    },
    totalBeforeTax: {
      type: Number,  // Subtotal after discounts but before taxes
      required: true,
      min: 0
    },
    shipping: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
