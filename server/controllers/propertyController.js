import Property, { PROPERTY_STATUSES } from '../models/Property.js';
import { stringify } from 'csv-stringify/sync';

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

export {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getAnalytics,
  exportPropertiesCsv,
};
