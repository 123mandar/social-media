import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AnalyticsCharts = ({ properties }) => {
  const statuses = ['Interested', 'Negotiating', 'Booked', 'Rejected', 'Bought'];
  const statusCounts = statuses.map((status) => properties.filter((property) => property.status === status).length);

  const roiData = {
    labels: properties.map((property) => property.title),
    datasets: [
      {
        label: 'ROI %',
        data: properties.map((property) => property.roi),
        backgroundColor: '#6366f1',
      },
    ],
  };

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <h3 className="mb-4 font-semibold">Property Count by Status</h3>
        <Doughnut
          data={{
            labels: statuses,
            datasets: [{ data: statusCounts, backgroundColor: ['#3b82f6', '#f59e0b', '#8b5cf6', '#f43f5e', '#10b981'] }],
          }}
        />
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <h3 className="mb-4 font-semibold">ROI Comparison</h3>
        <Bar data={roiData} />
      </div>
    </section>
  );
};

export default AnalyticsCharts;
