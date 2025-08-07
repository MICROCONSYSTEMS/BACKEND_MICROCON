import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    middleName: {
      type: String,
      trim: true,
      default:null,
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer'
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10,15}$/, 'Please enter a valid phone number']
    },
    profile_picture:
    {
      url: {
        type: String,
        trim: true
      },
      filename: {
        type: String,
        trim: true
      }
    },
    addresses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AddressBook'
    }],
    organization_name: {
      type: String,
      trim: true
    },
    gst_number: {
      type: String,
      trim: true,
      match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number']
    },
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model('User', userSchema); 