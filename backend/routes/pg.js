import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { PG } from '../models/PG.js';
import { protect, authorize } from '../middleware/auth.js';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @desc    Get all PGs
// @route   GET /api/pgs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, gender, min_price, max_price, locality, query } = req.query;

    let filter = {};

    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }
    if (gender) {
      filter.gender = gender;
    }
    if (locality) {
      filter.locality = { $regex: locality, $options: 'i' };
    }
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { locality: { $regex: query, $options: 'i' } }
      ];
    }

    let pgs = await PG.find(filter).sort({ createdAt: -1 });

    // Filter by price if specified
    if (min_price || max_price) {
      pgs = pgs.filter(pg => {
        const prices = pg.sharing_types.map(st => st.price);
        if (prices.length === 0) return false;
        const minPgPrice = Math.min(...prices);
        if (min_price && minPgPrice < min_price) return false;
        if (max_price && minPgPrice > max_price) return false;
        return true;
      });
    }

    res.json({ pgs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single PG
// @route   GET /api/pgs/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    res.json({ pg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new PG
// @route   POST /api/pgs
// @access  Private (Owner only)
router.post('/', protect, authorize('owner'), async (req, res) => {
  try {
    const { name, city, locality, address, gender, description, sharing_types, amenities } = req.body;

    // Parse JSON strings
    let sharingTypesParsed, amenitiesParsed;
    try {
      sharingTypesParsed = JSON.parse(sharing_types);
      amenitiesParsed = JSON.parse(amenities);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid JSON in sharing_types or amenities' });
    }

    // Handle file uploads
    let imagePaths = [];
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(__dirname, '..', 'uploads', 'pgs');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      for (const image of images) {
        const fileName = `${uuidv4()}${path.extname(image.name)}`;
        const filePath = path.join(uploadDir, fileName);

        await image.mv(filePath);
        imagePaths.push(`/uploads/pgs/${fileName}`);
      }
    }

    const pg = await PG.create({
      name,
      owner_id: req.user._id,
      city,
      locality,
      address,
      gender,
      description,
      images: imagePaths,
      sharing_types: sharingTypesParsed,
      amenities: amenitiesParsed
    });

    res.status(201).json({ message: 'PG created successfully', pg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update PG
// @route   PUT /api/pgs/:id
// @access  Private (Owner only)
router.put('/:id', protect, authorize('owner'), async (req, res) => {
  try {
    let pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    // Make sure user owns the PG
    if (pg.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this PG' });
    }

    const updateData = {};
    const allowedFields = ['name', 'city', 'locality', 'address', 'gender', 'description', 'sharing_types', 'amenities'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'sharing_types' || field === 'amenities') {
          try {
            updateData[field] = JSON.parse(req.body[field]);
          } catch (error) {
            // Skip invalid JSON
          }
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    pg = await PG.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({ message: 'PG updated successfully', pg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete PG
// @route   DELETE /api/pgs/:id
// @access  Private (Owner only)
router.delete('/:id', protect, authorize('owner'), async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    // Make sure user owns the PG
    if (pg.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this PG' });
    }

    await PG.findByIdAndDelete(req.params.id);

    res.json({ message: 'PG deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get owner's PGs
// @route   GET /api/pgs/owner/mine
// @access  Private (Owner only)
router.get('/owner/mine', protect, authorize('owner'), async (req, res) => {
  try {
    const pgs = await PG.find({ owner_id: req.user._id }).sort({ createdAt: -1 });

    res.json({ pgs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;
