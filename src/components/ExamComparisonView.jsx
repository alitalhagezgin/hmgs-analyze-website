import { useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, FileText, Image, Loader2 } from 'lucide-react';
import { exportToPDF, exportToPNG } from '../utils/exportHelpers';
import { TOPICS } from '../data/topics';
import PrintableComparison from './PrintableComparison';

// Puan 0-100 arasında renk
const BAR_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

function formatDate(iso) {
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

function TrendIcon({ diff }) {
  if (diff > 0)  return <TrendingUp  size={14} className="text-green-500 shrink-0" />;
  if (diff < 0)  return <TrendingDown size={14} className="text-red-400 shrink-0" />;
  return <Minus size={14} className="text-slate-400 shrink-0" />;
}

export default function ExamComparisonView({ exams, onBack, theme }) {
  const contentRef    = useRef(null);
  const printableRef  = useRef(null);
  const [exporting, setExporting] = useState(null);

  const isDark    = theme === 'dark';
  const chartText = isDark ? '#94a3b8' : '#64748b';
  const chartGrid = isDark ? '#334155' : '#f1f5f9';

  // Bar chart verisi: her sınav bir grup
  const scoreBarData = exams.map((e, i) => ({
    name: e.name.length > 12 ? e.name.slice(0, 12) + '…' : e.name,
    fullName: e.name,
    'Min. Puan':     e.stats.minimumScore,
    'Tahmini Puan':  e.stats.estimatedScore,
    color: BAR_COLORS[i % BAR_COLORS.length],
  }));

  // Metrik karşılaştırma satırları
  const metrics = [
    { label: 'Doğru',        key: 'correctCount',     emoji: '✅' },
    { label: 'Yanlış',       key: 'wrongCount',        emoji: '❌' },
    { label: 'Boş',          key: 'blankCount',        emoji: '⚪' },
    { label: 'Min. Puan',    key: 'minimumScore',      emoji: '📊', decimals: 2 },
    { label: 'Tahmini Puan', key: 'estimatedScore',    emoji: '🎯', decimals: 2 },
  ];

  // Konu başarı oranları
  const topicRows = TOPICS.map(topicName => {
    const rates = exams.map(e => {
      const t = e.stats.topicBreakdown?.find(td => td.topicName === topicName);
      return { rate: t?.successRate ?? 0, total: t?.total ?? 0 };
    });
    // En az bir sınavda bu konudan soru varsa göster
    if (rates.every(r => r.total === 0)) return null;
    return { topicName, rates };
  }).filter(Boolean);

  async function handleExport(type) {
    setExporting(type);
    try {
      const today = new Date().toISOString().slice(0, 10);
      if (type === 'pdf') await exportToPDF(printableRef, `HMGS-Karsilastirma-${today}.pdf`);
      else                await exportToPNG(printableRef, `HMGS-Karsilastirma-${today}.png`);
    } finally {
      setExporting(null);
    }
  }

  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const fullName = scoreBarData.find(d => d.name === label)?.fullName ?? label;
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">{fullName}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.fill }} className="font-medium">
            {p.dataKey}: {p.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Sticky üst bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft size={18} />
            Listeye Dön
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Karşılaştırma ({exams.length} Sınav)
          </h1>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => handleExport('png')}
              disabled={!!exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {exporting === 'png' ? <Loader2 size={14} className="animate-spin" /> : <Image size={14} />}
              {exporting === 'png' ? 'İndiriliyor...' : 'PNG'}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={!!exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {exporting === 'pdf' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              {exporting === 'pdf' ? 'İndiriliyor...' : 'PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Export kapsamındaki içerik */}
      <div ref={contentRef} className="bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">

          {/* Sınav renk legend */}
          <div className="flex flex-wrap gap-3">
            {exams.map((e, i) => (
              <div key={e.id} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
                <span className="text-slate-700 dark:text-slate-200 font-medium">{e.name}</span>
                <span className="text-slate-400 dark:text-slate-500 text-xs">{formatDate(e.savedAt)}</span>
              </div>
            ))}
          </div>

          {/* Puan karşılaştırma grafiği */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm transition-colors duration-200">
            <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4 uppercase tracking-wide">Puan Karşılaştırması</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={scoreBarData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartText }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: chartText }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: chartText }} />
                <Bar dataKey="Min. Puan"    fill="#94a3b8" radius={[3,3,0,0]} />
                <Bar dataKey="Tahmini Puan" fill="#6366f1" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Genel istatistik tablosu */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm transition-colors duration-200">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Genel Karşılaştırma</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/40">
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 dark:text-slate-400">Metrik</th>
                    {exams.map((e, i) => (
                      <th key={e.id} className="text-center px-4 py-3 font-semibold" style={{ color: BAR_COLORS[i % BAR_COLORS.length] }}>
                        {e.name}
                      </th>
                    ))}
                    {exams.length === 2 && (
                      <th className="text-center px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">Fark</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map(({ label, key, emoji, decimals }) => {
                    const vals = exams.map(e => e.stats[key]);
                    const diff = exams.length === 2 ? vals[1] - vals[0] : null;
                    return (
                      <tr key={key} className="border-t border-slate-100 dark:border-slate-700">
                        <td className="px-5 py-3 text-slate-700 dark:text-slate-200">
                          {emoji} {label}
                        </td>
                        {vals.map((v, i) => (
                          <td key={i} className="text-center px-4 py-3 font-bold text-slate-800 dark:text-slate-100">
                            {decimals ? v.toFixed(decimals) : v}
                          </td>
                        ))}
                        {diff !== null && (
                          <td className={`text-center px-4 py-3 font-semibold ${diff > 0 ? 'text-green-600 dark:text-green-400' : diff < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                            {diff > 0 ? '+' : ''}{decimals ? diff.toFixed(decimals) : diff}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Konu bazlı karşılaştırma */}
          {topicRows.length > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm transition-colors duration-200">
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Konu Bazlı Karşılaştırma</h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {topicRows.map(({ topicName, rates }) => {
                  const diff = rates.length === 2 ? rates[1].rate - rates[0].rate : null;
                  return (
                    <div key={topicName} className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 w-48 shrink-0">{topicName}</span>
                      <div className="flex flex-wrap gap-4 flex-1">
                        {rates.map((r, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
                            <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${r.rate}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">%{r.rate}</span>
                            {r.total > 0 && (
                              <span className="text-xs text-slate-400">({r.total})</span>
                            )}
                          </div>
                        ))}
                      </div>
                      {diff !== null && (
                        <div className={`flex items-center gap-1 text-xs font-semibold shrink-0 ${diff > 0 ? 'text-green-600 dark:text-green-400' : diff < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                          <TrendIcon diff={diff} />
                          {diff > 0 ? '+' : ''}{diff}%
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ekran dışı — sadece export hedefi */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <PrintableComparison ref={printableRef} exams={exams} />
      </div>
    </div>
  );
}
