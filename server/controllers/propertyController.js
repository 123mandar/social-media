import Property, { PROPERTY_STATUSES } from '../models/Property.js';
import { stringify } from 'csv-stringify/sync';
import xlsx from 'xlsx';

const parseSort = (sortBy, order) => {
  const allowedSortFields = ['price', 'roi', 'createdAt', 'updatedAt'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const safeOrder = order === 'asc' ? 1 : -1;
  return { [safeSortBy]: safeOrder };
};

const getProperties = async (req, res) => {
  const { status, search, sortBy, order } = req.query;
  const query = { userId: req.user._id };

  if (status && PROPERTY_STATUSES.includes(status)) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { location: { $regex: search, $options: 'i' } },
      { builder: { $regex: search, $options: 'i' } },
    ];
  }

  const properties = await Property.find(query).sort(parseSort(sortBy, order));
  return res.json({ properties });
};

const createProperty = async (req, res) => {
  const property = await Property.create({
    ...req.body,
    userId: req.user._id,
  });

  return res.status(201).json({ property });
};

const updateProperty = async (req, res) => {
  const { id } = req.params;
  const property = await Property.findOne({ _id: id, userId: req.user._id });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  Object.assign(property, req.body);
  await property.save();

  return res.json({ property });
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;
  const property = await Property.findOneAndDelete({ _id: id, userId: req.user._id });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  return res.json({ message: 'Property deleted successfully' });
};

const getAnalytics = async (req, res) => {
  const [statusCounts, avgRoiResult] = await Promise.all([
    Property.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Property.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, avgRoi: { $avg: '$roi' } } },
    ]),
  ]);

  const byStatus = PROPERTY_STATUSES.map((status) => {
    const found = statusCounts.find((entry) => entry._id === status);
    return { status, count: found ? found.count : 0 };
  });

  return res.json({
    byStatus,
    averageRoi: avgRoiResult[0]?.avgRoi || 0,
  });
};

const exportPropertiesCsv = async (req, res) => {
  const properties = await Property.find({ userId: req.user._id }).sort({ createdAt: -1 });

  const csv = stringify(
    properties.map((property) => ({
      title: property.title,
      location: property.location,
      price: property.price,
      builder: property.builder,
      roi: property.roi,
      propertyType: property.propertyType,
      status: property.status,
      notes: property.notes,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    })),
    { header: true }
  );

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="properties.csv"');
  return res.send(csv);
};

const parseNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const normalized = value.replace(/,/g, '').trim();
    if (!normalized) return NaN;
    return Number(normalized);
  }
  return NaN;
};

const importPropertiesFromExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an Excel file (.xlsx or .xls)' });
  }

  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const firstSheet = workbook.SheetNames[0];

  if (!firstSheet) {
    return res.status(400).json({ message: 'Excel file does not contain any sheet' });
  }

  const rows = xlsx.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: '' });

  if (!rows.length) {
    return res.status(400).json({ message: 'Excel file is empty' });
  }

  const errors = [];
  const validDocs = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const title = String(row.title || '').trim();
    const location = String(row.location || '').trim();
    const builder = String(row.builder || '').trim();
    const propertyType = String(row.propertyType || '').trim();
    const status = String(row.status || 'Interested').trim();
    const notes = String(row.notes || '').trim();
    const price = parseNumber(row.price);
    const roi = parseNumber(row.roi);

    if (!title || !location || !builder || !propertyType || Number.isNaN(price) || Number.isNaN(roi)) {
      errors.push(`Row ${rowNumber}: Missing/invalid required fields (title, location, builder, propertyType, price, roi)`);
      return;
    }

    if (!PROPERTY_STATUSES.includes(status)) {
      errors.push(`Row ${rowNumber}: Status must be one of ${PROPERTY_STATUSES.join(', ')}`);
      return;
    }

    validDocs.push({
      userId: req.user._id,
      title,
      location,
      price,
      builder,
      roi,
      propertyType,
      status,
      notes,
    });
  });

  if (!validDocs.length) {
    return res.status(400).json({
      message: 'No valid rows found in Excel file',
      errors,
    });
  }

  await Property.insertMany(validDocs);

  return res.status(201).json({
    message: 'Excel import completed',
    insertedCount: validDocs.length,
    skippedCount: rows.length - validDocs.length,
    errors,
  });
};

export {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getAnalytics,
  exportPropertiesCsv,
  importPropertiesFromExcel,
};
