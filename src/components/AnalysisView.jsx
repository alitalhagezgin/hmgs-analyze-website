import { useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { ArrowLeft, CheckCircle, XCircle, HelpCircle, Target, FileText, Image, Circle, Loader2 } from 'lucide-react';
import { computeAnalytics } from '../utils/analytics';
import { exportToPDF, exportToPNG } from '../utils/exportHelpers';
import StatCard from './StatCard';
import TopicCard from './TopicCard';
import NetExplanation from './NetExplanation';
import { TOTAL_QUESTIONS } from '../data/topics';

const PIE_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#94a3b8', '#6b7280', '#cbd5e1'];

export default function AnalysisView({ questions, onBack, theme }) {
  const stats = computeAnalytics(questions);
  const analysisRef = useRef(null);
  const [exporting, setExporting] = useState(null); // 'pdf' | 'png' | null

  const isDark = theme === 'dark';
  const chartTextColor  = isDark ? '#94a3b8' : '#64748b';
  const chartGridColor  = isDark ? '#334155' : '#f1f5f9';

  const pieData = [
    { name: 'Doğru',         value: stats.correct },
    { name: 'Yanlış',        value: stats.wrong },
    { name: 'Kararsız',      value: stats.nearCorrect + stats.nearWrong },
    { name: 'Hatırlamıyor',  value: stats.forgot },
    { name: 'Boş',           value: stats.blank },
  ].filter(d => d.value > 0);

  const barData = stats.byTopic
    .filter(t => t.total > 0)
    .map(t => ({
      name:     t.topicName.split(' ').slice(0, 2).join(' '),
      fullName: t.topicName,
      Doğru:    t.correct,
      Yanlış:   t.wrong,
      Diğer:    t.nearCorrect + t.nearWrong + t.forgot + t.blank,
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const fullName = barData.find(d => d.name === label)?.fullName ?? label;
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">{fullName}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.fill }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  };

  async function handleExport(type) {
    setExporting(type);
    try {
      const today = new Date().toISOString().slice(0, 10);
      if (type === 'pdf') {
        await exportToPDF(analysisRef, `HMGS-Analiz-${today}.pdf`);
      } else {
        await exportToPNG(analysisRef, `HMGS-Analiz-${today}.png`);
      }
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Üst bar (sticky, export hariç tutmak için ref dışında) */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft size={18} />
            Geri Dön
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Sınav Analizi</h1>

          {stats.unassignedCount > 0 && (
            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium px-2 py-1 rounded-full">
              {stats.unassignedCount} konu atanmamış
            </span>
          )}

          {/* Export butonları */}
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => handleExport('png')}
              disabled={!!exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {exporting === 'png'
                ? <Loader2 size={14} className="animate-spin" />
                : <Image size={14} />}
              {exporting === 'png' ? 'İndiriliyor...' : 'PNG'}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={!!exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {exporting === 'pdf'
                ? <Loader2 size={14} className="animate-spin" />
                : <FileText size={14} />}
              {exporting === 'pdf' ? 'İndiriliyor...' : 'PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Export'a dahil olan içerik */}
      <div ref={analysisRef} className="bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
          {/* Genel istatistikler */}
          <section>
            <h2 className="text-base font-bold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">Genel Sonuç</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard
                label="Doğru"
                value={stats.correct}
                sub={`%${Math.round((stats.correct / TOTAL_QUESTIONS) * 100)}`}
                colorClass="text-green-600 dark:text-green-400"
                bgClass="bg-green-50 dark:bg-green-900/20"
                icon={<CheckCircle size={14} className="text-green-500" />}
              />
              <StatCard
                label="Yanlış"
                value={stats.wrong}
                sub={`%${Math.round((stats.wrong / TOTAL_QUESTIONS) * 100)}`}
                colorClass="text-red-600 dark:text-red-400"
                bgClass="bg-red-50 dark:bg-red-900/20"
                icon={<XCircle size={14} className="text-red-500" />}
              />
              <StatCard
                label="Boş"
                value={stats.blank}
                sub="Nete etki etmez"
                colorClass="text-slate-600 dark:text-slate-400"
                bgClass="bg-slate-100 dark:bg-slate-800"
                icon={<Circle size={14} className="text-slate-400" />}
              />
              <StatCard
                label="Kararsız / Unuttu"
                value={stats.nearCorrect + stats.nearWrong + stats.forgot}
                sub={`${stats.nearCorrect} yakın doğru · ${stats.nearWrong} yakın yanlış · ${stats.forgot} unuttu`}
                colorClass="text-amber-600 dark:text-amber-400"
                bgClass="bg-amber-50 dark:bg-amber-900/20"
                icon={<HelpCircle size={14} className="text-amber-500" />}
              />
              <StatCard
                label="Tahmini Net"
                value={stats.estimatedNet.toFixed(2)}
                sub={`Min: ${stats.minNet.toFixed(2)}`}
                colorClass={stats.estimatedNet >= 0 ? 'text-indigo-700 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'}
                bgClass="bg-indigo-50 dark:bg-indigo-900/20"
                icon={<Target size={14} className="text-indigo-500" />}
              />
            </div>
          </section>

          {/* Net açıklama kutusu */}
          <NetExplanation minNet={stats.minNet} estimatedNet={stats.estimatedNet} />

          {/* Grafikler */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm transition-colors duration-200">
              <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4 uppercase tracking-wide">Konu Bazlı Dağılım</h2>
              {barData.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-8">Hiç konu atanmamış</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: chartTextColor }}
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 10, fill: chartTextColor }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8, color: chartTextColor }} />
                    <Bar dataKey="Doğru"  fill="#22c55e" radius={[3,3,0,0]} />
                    <Bar dataKey="Yanlış" fill="#ef4444" radius={[3,3,0,0]} />
                    <Bar dataKey="Diğer"  fill="#94a3b8" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm transition-colors duration-200">
              <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4 uppercase tracking-wide">Genel Durum Dağılımı</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 12, color: chartTextColor }} />
                  <Tooltip
                    formatter={(val, name) => [`${val} soru`, name]}
                    contentStyle={{
                      backgroundColor: isDark ? '#1e293b' : '#fff',
                      borderColor: isDark ? '#475569' : '#e2e8f0',
                      borderRadius: 12,
                      color: isDark ? '#e2e8f0' : '#334155',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Konu bazlı kartlar */}
          <section>
            <h2 className="text-base font-bold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">Konu Bazlı Analiz</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.byTopic.map(t => (
                <TopicCard key={t.topicName} data={t} />
              ))}
            </div>
            {stats.byTopic.every(t => t.total === 0) && (
              <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-8">
                Sorulara konu atamadığınız için konu bazlı analiz gösterilemiyor.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
