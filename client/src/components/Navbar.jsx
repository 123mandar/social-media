import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, onToggleDarkMode }) => {
  const { user, logout } = useAuth();

  return (
    <header className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
      <div>
        <h2 className="text-lg font-semibold">Property Dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">Welcome back, {user?.name}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="rounded-lg border border-slate-200 p-2 dark:border-slate-600"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white dark:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
