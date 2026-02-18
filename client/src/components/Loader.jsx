const Loader = ({ text = 'Loading...' }) => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="rounded-lg bg-white px-4 py-3 shadow dark:bg-slate-800">{text}</div>
  </div>
);

export default Loader;
