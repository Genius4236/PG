import mongoose from 'mongoose';

export const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  pg_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'PG',
    required: true
  },
  sharing_type: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Triple', 'Quad']
  },
  move_in_date: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'Duration must be at least 1 month']
  },
  monthly_rent: {
    type: Number,
    required: true,
    min: [0, 'Monthly rent must be positive']
  },
  security_deposit: {
    type: Number,
    default: 10000,
    min: [0, 'Security deposit must be positive']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  total_amount: {
    type: Number,
    required: true,
    min: [0, 'Total amount must be positive']
  },
  user_name: {
    type: String,
    required: true,
    trim: true
  },
  user_email: {
    type: String,
    required: true,
    lowercase: true
  },
  user_phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

export const Booking = mongoose.model('Booking', bookingSchema);
