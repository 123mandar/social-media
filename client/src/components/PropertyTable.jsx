import { STATUS_COLORS } from '../utils/constants';

const PropertyTable = ({ properties, onEdit, onDelete }) => (
  <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-800">
    <table className="min-w-full">
      <thead className="bg-slate-100 dark:bg-slate-700">
        <tr>
          {['Title', 'Location', 'Price', 'Builder', 'ROI', 'Type', 'Status', 'Actions'].map((head) => (
            <th key={head} className="table-cell text-left font-semibold">
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {properties.map((property) => (
          <tr key={property._id} className="border-t border-slate-200 dark:border-slate-700">
            <td className="table-cell">{property.title}</td>
            <td className="table-cell">{property.location}</td>
            <td className="table-cell">₹{Number(property.price).toLocaleString()}</td>
            <td className="table-cell">{property.builder}</td>
            <td className="table-cell">{property.roi}%</td>
            <td className="table-cell">{property.propertyType}</td>
            <td className="table-cell">
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${STATUS_COLORS[property.status] || 'bg-slate-100 text-slate-800'}`}>
                {property.status}
              </span>
            </td>
            <td className="table-cell">
              <div className="flex gap-2">
                <button type="button" onClick={() => onEdit(property)} className="rounded bg-amber-500 px-2 py-1 text-xs text-white">
                  Edit
                </button>
                <button type="button" onClick={() => onDelete(property)} className="rounded bg-rose-600 px-2 py-1 text-xs text-white">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {!properties.length && <p className="p-4 text-sm text-slate-500 dark:text-slate-300">No properties found.</p>}
  </div>
);

export default PropertyTable;
