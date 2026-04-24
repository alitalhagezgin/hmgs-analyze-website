export default function StatCard({ label, value, sub, colorClass = 'text-indigo-600 dark:text-indigo-400', bgClass = 'bg-indigo-50 dark:bg-indigo-900/20', icon }) {
  return (
    <div className={`${bgClass} rounded-2xl p-5 flex flex-col gap-1 border border-white/10 shadow-sm transition-colors duration-200`}>
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
        {icon}
        {label}
      </div>
      <div className={`text-3xl font-extrabold ${colorClass}`}>{value}</div>
      {sub && <div className="text-xs text-slate-400 dark:text-slate-500">{sub}</div>}
    </div>
  );
}
