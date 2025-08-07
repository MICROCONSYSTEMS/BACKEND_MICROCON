import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    product_number: {
      type: String,
      unique: true,
      trim: true
    },
    productType: {
      type: String,
      enum: ['component', 'assembly'],
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory'
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand'
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    reorderLevel: {
      type: Number,
      default: 0,
      min: 0
    },
    discountId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
      }
    ],
    images: [
      {
        url: {
          type: String,
          trim: true
        },
        filename: {
          type: String,
          trim: true
        }
      }
    ],
    components: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    manual: {
      url: {
        type: String,
        trim: true
      },
      filename: {
        type: String,
        trim: true
      }
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: true // true = active, false = deleted/inactive
    }
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
