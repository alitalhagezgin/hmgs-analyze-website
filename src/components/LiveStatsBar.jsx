import { useMemo } from 'react';
import { CheckCircle2, XCircle, Circle, TrendingUp } from 'lucide-react';

const TOTAL = 120;

export default function LiveStatsBar({ questions }) {
  const stats = useMemo(() => {
    const counts = {
      correct: 0,
      wrong: 0,
      near_correct: 0,
      near_wrong: 0,
      forgot: 0,
      blank: 0,
      unanswered: 0,
    };

    questions.forEach(q => {
      if (!q.status) {
        counts.unanswered++;
      } else {
        counts[q.status] = (counts[q.status] || 0) + 1;
      }
    });

    const answered = TOTAL - counts.unanswered;
    const progress = (answered / TOTAL) * 100;

    const estimatedCorrect =
      counts.correct +
      counts.near_correct * 0.7 +
      counts.near_wrong * 0.3;
    const estimatedScore = (estimatedCorrect / TOTAL) * 100;
    const minimumScore = (counts.correct / TOTAL) * 100;

    return {
      ...counts,
      answered,
      progress,
      estimatedScore,
      minimumScore,
      skippedTotal: counts.forgot + counts.blank,
    };
  }, [questions]);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-3 md:p-4">
      {/* İlerleme satırı */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">İlerleme</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {stats.answered} / {TOTAL} soru
          <span className="ml-2 font-bold text-indigo-600 dark:text-indigo-400">
            %{stats.progress.toFixed(0)}
          </span>
        </span>
      </div>

      {/* İlerleme çubuğu */}
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${stats.progress}%` }}
        />
      </div>

      {/* Canlı istatistikler — 2 sütun (mobil) → 3 sütun (tablet) → 6 sütun (masaüstü) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <StatChip
          icon={<CheckCircle2 size={15} />}
          label="Doğru"
          value={stats.correct}
          color="emerald"
        />
        <StatChip
          icon={<CheckCircle2 size={15} />}
          label="Doğruya Yakın"
          value={stats.near_correct}
          color="lime"
        />
        <StatChip
          icon={<XCircle size={15} />}
          label="Yanlışa Yakın"
          value={stats.near_wrong}
          color="orange"
        />
        <StatChip
          icon={<XCircle size={15} />}
          label="Yanlış"
          value={stats.wrong}
          color="red"
        />
        <StatChip
          icon={<Circle size={15} />}
          label="Boş/Unuttu"
          value={stats.skippedTotal}
          color="slate"
        />
        <StatChip
          icon={<TrendingUp size={15} />}
          label="Tahmini Puan"
          value={stats.estimatedScore.toFixed(1)}
          subtext={`Min: ${stats.minimumScore.toFixed(1)}`}
          color="indigo"
          highlight
        />
      </div>
    </div>
  );
}

const COLOR_CLASSES = {
  emerald: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  lime:    'text-lime-700 dark:text-lime-400 bg-lime-50 dark:bg-lime-900/20 border-lime-200 dark:border-lime-800',
  orange:  'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  red:     'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  slate:   'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-600',
  indigo:  'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
};

function StatChip({ icon, label, value, subtext, color, highlight }) {
  return (
    <div className={`
      flex items-center gap-2 px-3 py-2 rounded-lg border
      ${COLOR_CLASSES[color]}
      ${highlight ? 'ring-1 ring-current ring-opacity-20' : ''}
      transition-colors
    `}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] md:text-xs font-medium opacity-70 uppercase tracking-wide truncate">
          {label}
        </div>
        <div className="text-base md:text-lg font-bold leading-tight">
          {value}
        </div>
        {subtext && (
          <div className="text-[9px] md:text-[10px] opacity-60 leading-tight">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}
