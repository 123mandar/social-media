import mongoose from 'mongoose';

export const PROPERTY_STATUSES = [
  'Interested',
  'Negotiating',
  'Booked',
  'Rejected',
  'Bought',
];

const propertySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    builder: {
      type: String,
      required: [true, 'Builder name is required'],
      trim: true,
    },
    roi: {
      type: Number,
      required: [true, 'Expected ROI is required'],
      min: 0,
      max: 1000,
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: PROPERTY_STATUSES,
      default: 'Interested',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model('Property', propertySchema);

export default Property;
