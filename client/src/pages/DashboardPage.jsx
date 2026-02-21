import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import AnalyticsCharts from '../components/AnalyticsCharts';
import Navbar from '../components/Navbar';
import PropertyFormModal from '../components/PropertyFormModal';
import PropertyTable from '../components/PropertyTable';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import api from '../services/api';
import { STATUSES } from '../utils/constants';

const DashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const excelInputRef = useRef(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/properties', {
        params: { status: statusFilter, search, sortBy, order },
      });
      setProperties(data.properties);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, search, sortBy, order]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const openAddModal = () => {
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const handleSaveProperty = async (payload) => {
    try {
      setIsSaving(true);
      if (selectedProperty) {
        await api.put(`/properties/${selectedProperty._id}`, payload);
        toast.success('Property updated');
      } else {
        await api.post('/properties', payload);
        toast.success('Property added');
      }
      setIsModalOpen(false);
      fetchProperties();
    } catch (error) {
      const validationError = error.response?.data?.errors?.[0]?.msg;
      toast.error(validationError || error.response?.data?.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (property) => {
    const shouldDelete = window.confirm(`Delete ${property.title}?`);
    if (!shouldDelete) return;

    try {
      await api.delete(`/properties/${property._id}`);
      toast.success('Property deleted');
      fetchProperties();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleExportCsv = async () => {
    try {
      const response = await api.get('/properties/export/csv', { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'properties.csv';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };


  const handleExcelImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/properties/import/excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`Imported ${data.insertedCount} properties from Excel`);
      if (data.errors?.length) {
        toast((t) => (
          <div className="max-w-sm text-sm">
            <p className="font-semibold">Imported with warnings</p>
            <p>{data.errors[0]}</p>
            <button className="mt-2 rounded bg-slate-800 px-2 py-1 text-white" onClick={() => toast.dismiss(t.id)}>
              Close
            </button>
          </div>
        ));
      }
      fetchProperties();
    } catch (error) {
      const message = error.response?.data?.message || 'Excel import failed';
      toast.error(message);
    } finally {
      event.target.value = '';
    }
  };

  const content = useMemo(() => {
    if (loading) return <p className="rounded-xl bg-white p-4 dark:bg-slate-800">Loading properties...</p>;

    return (
      <>
        <StatsCards properties={properties} />
        <AnalyticsCharts properties={properties} />
        <PropertyTable
          properties={properties}
          onEdit={(property) => {
            setSelectedProperty(property);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </>
    );
  }, [loading, properties]);

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
      <Sidebar />
      <main className="w-full p-4 md:p-6">
        <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />

        <div className="mb-4 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 lg:flex-row lg:items-center">
          <button onClick={openAddModal} className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
            + Add Property
          </button>
          <button onClick={handleExportCsv} className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600">
            Export CSV
          </button>
          <button
            onClick={() => excelInputRef.current?.click()}
            className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600"
          >
            Import Excel
          </button>
          <input
            ref={excelInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelImport}
            className="hidden"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by location or builder"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900 lg:max-w-xs"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
          >
            <option value="">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
          >
            <option value="createdAt">Newest</option>
            <option value="price">Price</option>
            <option value="roi">ROI</option>
          </select>
          <select
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {content}
      </main>

      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProperty}
        property={selectedProperty}
        isSubmitting={isSaving}
      />
    </div>
  );
};

export default DashboardPage;
