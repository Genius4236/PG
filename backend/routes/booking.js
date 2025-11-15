import express from 'express';
import { body, validationResult } from 'express-validator';
import { Booking } from '../models/Booking.js';
import { PG } from '../models/PG.js';
import { protect, authorize } from '../middleware/auth.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (User only)
router.post('/', protect, authorize('user'), [
  body('pg_id').notEmpty().withMessage('PG ID is required'),
  body('sharing_type').notEmpty().withMessage('Sharing type is required'),
  body('move_in_date').notEmpty().withMessage('Move in date is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 month'),
  body('monthly_rent').isFloat({ min: 0 }).withMessage('Monthly rent must be positive'),
  body('total_amount').isFloat({ min: 0 }).withMessage('Total amount must be positive'),
  body('user_name').notEmpty().withMessage('User name is required'),
  body('user_email').isEmail().withMessage('Valid email is required'),
  body('user_phone').notEmpty().withMessage('User phone is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      pg_id,
      sharing_type,
      move_in_date,
      duration,
      monthly_rent,
      security_deposit = 10000,
      discount = 0,
      total_amount,
      user_name,
      user_email,
      user_phone
    } = req.body;

    // Check if PG exists
    const pg = await PG.findById(pg_id);
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    // Create booking
    const booking = await Booking.create({
      user_id: req.user._id,
      pg_id,
      sharing_type,
      move_in_date,
      duration,
      monthly_rent,
      security_deposit,
      discount,
      total_amount,
      user_name,
      user_email,
      user_phone
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private (User only)
router.get('/user', protect, authorize('user'), async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.user._id })
      .sort({ createdAt: -1 })
      .populate('pg_id', 'name locality city images');

    // Format response
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      user_id: booking.user_id,
      pg_id: booking.pg_id._id,
      pg_name: booking.pg_id.name,
      pg_locality: booking.pg_id.locality,
      pg_city: booking.pg_id.city,
      pg_image: booking.pg_id.images && booking.pg_id.images.length > 0 ? booking.pg_id.images[0] : '',
      sharing_type: booking.sharing_type,
      move_in_date: booking.move_in_date,
      duration: booking.duration,
      monthly_rent: booking.monthly_rent,
      security_deposit: booking.security_deposit,
      discount: booking.discount,
      total_amount: booking.total_amount,
      status: booking.status,
      created_at: booking.createdAt
    }));

    res.json({ bookings: formattedBookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get owner bookings
// @route   GET /api/bookings/owner
// @access  Private (Owner only)
router.get('/owner', protect, authorize('owner'), async (req, res) => {
  try {
    // Get all PGs owned by the current user
    const ownerPgs = await PG.find({ owner_id: req.user._id });
    const pgIds = ownerPgs.map(pg => pg._id);

    // Get all bookings for these PGs
    const bookings = await Booking.find({ pg_id: { $in: pgIds } })
      .sort({ createdAt: -1 })
      .populate('pg_id', 'name locality city')
      .populate('user_id', 'name email phone');

    // Format response
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      user_id: booking.user_id._id,
      user_name: booking.user_id.name,
      user_email: booking.user_id.email,
      user_phone: booking.user_id.phone,
      pg_id: booking.pg_id._id,
      pg_name: booking.pg_id.name,
      pg_locality: booking.pg_id.locality,
      pg_city: booking.pg_id.city,
      sharing_type: booking.sharing_type,
      move_in_date: booking.move_in_date,
      duration: booking.duration,
      monthly_rent: booking.monthly_rent,
      security_deposit: booking.security_deposit,
      discount: booking.discount,
      total_amount: booking.total_amount,
      status: booking.status,
      created_at: booking.createdAt
    }));

    res.json({ bookings: formattedBookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner only)
router.put('/:id/status', protect, authorize('owner'), [
  body('status').isIn(['active', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    // Find booking
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if owner owns the PG
    const pg = await PG.findById(booking.pg_id);
    if (!pg || pg.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Update status
    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
