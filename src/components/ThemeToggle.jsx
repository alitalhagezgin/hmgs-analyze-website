import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={theme === 'dark' ? 'Açık moda geç' : 'Koyu moda geç'}
      className="p-2 rounded-lg text-indigo-200 hover:text-white hover:bg-indigo-600 transition-colors"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
