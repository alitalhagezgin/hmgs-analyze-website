export default function TopicCard({ data }) {
  const { topicName, total, correct, wrong, nearCorrect, nearWrong, forgot, blank, successRate } = data;

  if (total === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight pr-4">{topicName}</h3>
        <span className="shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-full px-2 py-0.5">
          {total} soru
        </span>
      </div>

      {/* Başarı yüzdesi bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Başarı oranı</span>
          <span className={`font-bold ${successRate >= 70 ? 'text-green-600 dark:text-green-400' : successRate >= 40 ? 'text-orange-500' : 'text-red-500'}`}>
            %{successRate}
          </span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              successRate >= 70 ? 'bg-green-500' : successRate >= 40 ? 'bg-orange-400' : 'bg-red-500'
            }`}
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>

      {/* Dağılım */}
      <div className="grid grid-cols-6 gap-1 text-center">
        {[
          { label: '✅', val: correct,     cls: 'text-green-600 dark:text-green-400'   },
          { label: '❌', val: wrong,       cls: 'text-red-500 dark:text-red-400'       },
          { label: '🟢', val: nearCorrect, cls: 'text-emerald-500 dark:text-emerald-400'},
          { label: '🔴', val: nearWrong,   cls: 'text-orange-500 dark:text-orange-400' },
          { label: '❓', val: forgot,      cls: 'text-slate-400 dark:text-slate-500'   },
          { label: '⚪', val: blank ?? 0,  cls: 'text-slate-400 dark:text-slate-500'   },
        ].map(({ label, val, cls }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-sm">{label}</span>
            <span className={`text-sm font-bold ${cls}`}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
