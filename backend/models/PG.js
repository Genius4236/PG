import mongoose from 'mongoose';

export const sharingTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Triple', 'Quad']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive']
  },
  available: {
    type: Boolean,
    default: true
  }
});

export const pgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a PG name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  owner_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  city: {
    type: String,
    required: [true, 'Please add a city'],
    trim: true
  },
  locality: {
    type: String,
    required: [true, 'Please add a locality'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['boys', 'girls']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  images: [{
    type: String
  }],
  sharing_types: [sharingTypeSchema],
  amenities: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    default: 4.5,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews count cannot be negative']
  }
}, {
  timestamps: true
});

// Index for search functionality
pgSchema.index({ name: 'text', city: 'text', locality: 'text' });

export const PG = mongoose.model('PG', pgSchema);
