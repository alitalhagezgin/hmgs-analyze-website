import { TOTAL_QUESTIONS } from '../data/topics';

export default function ProgressBar({ answeredCount }) {
  const pct = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-4 shadow-sm transition-colors duration-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">İlerleme</span>
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
          {answeredCount} / {TOTAL_QUESTIONS} soru işaretlendi
        </span>
      </div>
      <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-right text-xs text-slate-400 dark:text-slate-500 mt-1">%{pct}</div>
    </div>
  );
}
