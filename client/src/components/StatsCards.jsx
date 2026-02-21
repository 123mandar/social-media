const StatsCards = ({ properties }) => {
  const total = properties.length;
  const interested = properties.filter((p) => p.status === 'Interested').length;
  const bought = properties.filter((p) => p.status === 'Bought').length;
  const averageRoi = total ? properties.reduce((sum, p) => sum + Number(p.roi), 0) / total : 0;

  const cards = [
    { title: 'Total Properties', value: total },
    { title: 'Interested Deals', value: interested },
    { title: 'Bought Deals', value: bought },
    { title: 'Average ROI', value: `${averageRoi.toFixed(2)}%` },
  ];

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-300">{card.title}</p>
          <p className="mt-2 text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </section>
  );
};

export default StatsCards;
