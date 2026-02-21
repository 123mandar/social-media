import express from 'express';
import { body } from 'express-validator';
import {
  createProperty,
  deleteProperty,
  exportPropertiesCsv,
  getAnalytics,
  getProperties,
  updateProperty,
} from '../controllers/propertyController.js';
import protect from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { PROPERTY_STATUSES } from '../models/Property.js';

const router = express.Router();

const propertyValidation = [
  body('title').trim().notEmpty().withMessage('Property title is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('builder').trim().notEmpty().withMessage('Builder is required'),
  body('roi').isFloat({ min: 0 }).withMessage('ROI must be a positive number'),
  body('propertyType').trim().notEmpty().withMessage('Property type is required'),
  body('status').isIn(PROPERTY_STATUSES).withMessage('Invalid status'),
  body('notes').optional().isString().withMessage('Notes must be text'),
];

router.use(protect);

router.get('/', getProperties);
router.get('/analytics', getAnalytics);
router.get('/export/csv', exportPropertiesCsv);
router.post('/', propertyValidation, validateRequest, createProperty);
router.put('/:id', propertyValidation, validateRequest, updateProperty);
router.delete('/:id', deleteProperty);

export default router;
