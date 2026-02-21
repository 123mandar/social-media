import { useEffect, useState } from 'react';
import { PROPERTY_TYPES, STATUSES } from '../utils/constants';

const initialState = {
  title: '',
  location: '',
  price: '',
  builder: '',
  roi: '',
  propertyType: PROPERTY_TYPES[0],
  status: STATUSES[0],
  notes: '',
};

const PropertyFormModal = ({ isOpen, onClose, onSubmit, property, isSubmitting }) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        location: property.location || '',
        price: property.price || '',
        builder: property.builder || '',
        roi: property.roi || '',
        propertyType: property.propertyType || PROPERTY_TYPES[0],
        status: property.status || STATUSES[0],
        notes: property.notes || '',
      });
      return;
    }
    setFormData(initialState);
  }, [property, isOpen]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
      roi: Number(formData.roi),
    });
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold">{property ? 'Edit Property' : 'Add Property'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { label: 'Property Title', name: 'title', type: 'text' },
            { label: 'Location', name: 'location', type: 'text' },
            { label: 'Price', name: 'price', type: 'number' },
            { label: 'Builder Name', name: 'builder', type: 'text' },
            { label: 'Expected ROI (%)', name: 'roi', type: 'number' },
          ].map((field) => (
            <label key={field.name} className="text-sm">
              <span className="mb-1 block">{field.label}</span>
              <input
                required
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
              />
            </label>
          ))}

          <label className="text-sm">
            <span className="mb-1 block">Property Type</span>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1 block">Status</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
            >
              {STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>

          <label className="text-sm md:col-span-2">
            <span className="mb-1 block">Notes</span>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
            />
          </label>

          <div className="flex justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;
