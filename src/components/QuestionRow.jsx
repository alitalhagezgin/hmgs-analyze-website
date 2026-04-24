import { STATUSES, TOPICS } from '../data/topics';

const STATUS_STYLES = {
  correct:      {
    active:   'bg-green-500 text-white border-green-500',
    inactive: 'border-green-400 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20',
  },
  wrong:        {
    active:   'bg-red-500 text-white border-red-500',
    inactive: 'border-red-400 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20',
  },
  near_correct: {
    active:   'bg-emerald-400 text-white border-emerald-400',
    inactive: 'border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-900/20',
  },
  near_wrong:   {
    active:   'bg-orange-400 text-white border-orange-400',
    inactive: 'border-orange-400 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900/20',
  },
  forgot:       {
    active:   'bg-slate-400 text-white border-slate-400',
    inactive: 'border-slate-300 text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700',
  },
  blank:        {
    active:   'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500',
    inactive: 'border-slate-200 text-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-500 dark:hover:bg-slate-700',
  },
};

export default function QuestionRow({ question, onStatusChange, onTopicChange, isActive, rowRef }) {
  const { questionNumber, status, topic } = question;

  return (
    <div
      ref={rowRef}
      className={`flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl border transition-all duration-150 ${
        isActive
          ? 'border-indigo-300 bg-indigo-50/50 dark:bg-indigo-900/20 dark:border-indigo-600 shadow-sm'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      {/* Soru numarası */}
      <span className="text-sm font-bold text-slate-500 dark:text-slate-400 w-16 shrink-0">
        Soru {questionNumber}
      </span>

      {/* Durum butonları — mobilde 2×3 grid, sm+ flex */}
      <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:gap-1.5 flex-1">
        {STATUSES.map(s => {
          const isSelected = status === s.key;
          const styles = STATUS_STYLES[s.key];
          return (
            <button
              key={s.key}
              onClick={() => onStatusChange(questionNumber, isSelected ? null : s.key)}
              title={s.label}
              className={`flex items-center justify-center gap-1 px-2 py-2 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 ${
                isSelected ? styles.active : styles.inactive
              }`}
            >
              <span>{s.emoji}</span>
              {/* sm 미만: shortLabel / md+: full label */}
              <span className="md:hidden">{s.shortLabel}</span>
              <span className="hidden md:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Konu seçimi */}
      <div className="shrink-0 sm:w-48">
        <select
          value={topic ?? ''}
          onChange={e => onTopicChange(questionNumber, e.target.value || null)}
          className={`w-full text-xs py-1.5 px-2 rounded-lg border bg-white dark:bg-slate-700 transition-colors cursor-pointer ${
            topic
              ? 'border-indigo-300 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 font-medium'
              : 'border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500'
          }`}
        >
          <option value="">— Konu seç —</option>
          {TOPICS.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
