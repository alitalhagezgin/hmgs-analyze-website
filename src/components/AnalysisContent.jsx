import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { CheckCircle, XCircle, HelpCircle, Target, Circle } from 'lucide-react';
import StatCard from './StatCard';
import TopicCard from './TopicCard';
import ScoreExplanation from './ScoreExplanation';
import { TOTAL_QUESTIONS } from '../data/topics';

const PIE_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#94a3b8', '#6b7280', '#cbd5e1'];

const SHORT_NAMES = {
  "Anayasa Hukuku":                  "Anayasa",
  "Anayasa Yargısı":                 "Any. Yarg.",
  "İdare Hukuku":                    "İdare",
  "İdari Yargılama Usulü":           "İYUK",
  "Medeni Hukuk":                    "Medeni",
  "Borçlar Hukuku":                  "Borçlar",
  "Ticaret Hukuku":                  "Ticaret",
  "Hukuk Yargılama Usulü":           "HMK",
  "İcra ve İflas Hukuku":            "İcra-İflas",
  "Ceza Hukuku":                     "Ceza",
  "Ceza Yargılama Usulü":            "CMK",
  "İş ve Sosyal Güvenlik Hukuku":    "İş-SGK",
  "Vergi Hukuku":                    "Vergi",
  "Vergi Usul Hukuku":               "VUK",
  "Avukatlık Hukuku":                "Avukatlık",
  "Hukuk Felsefesi ve Sosyolojisi":  "Huk. Fel.",
  "Türk Hukuk Tarihi":               "THT",
  "Milletlerarası Hukuk":            "Devletler H.",
  "Milletlerarası Özel Hukuk":       "MÖH",
  "Genel Kamu Hukuku":               "Gen. Kamu",
};

export default function AnalysisContent({ stats, theme, contentRef }) {
  const isDark        = theme === 'dark';
  const chartText     = isDark ? '#94a3b8' : '#64748b';
  const chartGrid     = isDark ? '#334155' : '#f1f5f9';

  const pieData = [
    { name: 'Doğru',        value: stats.correct },
    { name: 'Yanlış',       value: stats.wrong },
    { name: 'Kararsız',     value: stats.nearCorrect + stats.nearWrong },
    { name: 'Hatırlamıyor', value: stats.forgot },
    { name: 'Boş',          value: stats.blank },
  ].filter(d => d.value > 0);

  const barData = stats.byTopic
    .filter(t => t.total > 0)
    .map(t => ({
      name:     SHORT_NAMES[t.topicName] ?? t.topicName,
      fullName: t.topicName,
      Doğru:    t.correct,
      Yanlış:   t.wrong,
      Diğer:    t.nearCorrect + t.nearWrong + t.forgot + t.blank,
    }));

  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const fullName = barData.find(d => d.name === label)?.fullName ?? label;
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">{fullName}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.fill }} className="font-medium">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }

  return (
    <div ref={contentRef} className="bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
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
              sub="Puana etki etmez"
              colorClass="text-slate-600 dark:text-slate-400"
              bgClass="bg-slate-100 dark:bg-slate-800"
              icon={<Circle size={14} className="text-slate-400" />}
            />
            <StatCard
              label="Kararsız / Unuttu"
              value={stats.nearCorrect + stats.nearWrong + stats.forgot}
              sub={`${stats.nearCorrect} yakın D · ${stats.nearWrong} yakın Y · ${stats.forgot} unuttu`}
              colorClass="text-amber-600 dark:text-amber-400"
              bgClass="bg-amber-50 dark:bg-amber-900/20"
              icon={<HelpCircle size={14} className="text-amber-500" />}
            />
            <StatCard
              label="Tahmini Puan"
              value={stats.estimatedScore.toFixed(2)}
              sub={`Min: ${stats.minimumScore.toFixed(2)}`}
              colorClass="text-indigo-700 dark:text-indigo-400"
              bgClass="bg-indigo-50 dark:bg-indigo-900/20"
              icon={<Target size={14} className="text-indigo-500" />}
            />
          </div>
        </section>

        {/* Puan açıklama */}
        <ScoreExplanation minimumScore={stats.minimumScore} estimatedScore={stats.estimatedScore} />

        {/* Grafikler */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm transition-colors duration-200">
            <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4 uppercase tracking-wide">Konu Bazlı Dağılım</h2>
            {barData.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-8">Hiç konu atanmamış</p>
            ) : (
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 90 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    tickMargin={8}
                    tick={{ fontSize: 10, fill: chartText }}
                  />
                  <YAxis tick={{ fontSize: 10, fill: chartText }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={12}
                    wrapperStyle={{ fontSize: 12, paddingTop: 20, color: chartText }}
                  />
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
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12, color: chartText }} />
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
            {stats.byTopic.map(t => <TopicCard key={t.topicName} data={t} />)}
          </div>
          {stats.byTopic.every(t => t.total === 0) && (
            <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-8">
              Sorulara konu atamadığınız için konu bazlı analiz gösterilemiyor.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
