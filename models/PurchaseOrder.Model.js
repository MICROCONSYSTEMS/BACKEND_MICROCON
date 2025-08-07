import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be positive'],
    }
  }, { _id: false });

const purchaseOrderSchema = new mongoose.Schema(
  {
    purchaseOrderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    items: {
      type: [itemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount must be positive'],
    },
    pdf: {
      url: {
        type: String,
        required: true,
      },
      fileName: {
        type: String,
        required: true,
      }
    },
  },
  {
    timestamps: true,
  }
);

export const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
