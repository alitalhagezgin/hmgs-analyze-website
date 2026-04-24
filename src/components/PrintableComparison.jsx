import { forwardRef } from 'react';

// Saved exam stats formatı: correctCount, wrongCount, blankCount,
// nearCorrectCount, nearWrongCount, forgotCount, minimumScore, estimatedScore, topicBreakdown
// topicBreakdown: [{ topicName, total, correct, wrong, successRate, ... }]

const BAR_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const s = {
  root: {
    width: '1200px',
    padding: '40px',
    background: '#ffffff',
    color: '#0f172a',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    lineHeight: '1.5',
    boxSizing: 'border-box',
  },
  header: {
    marginBottom: '28px', paddingBottom: '16px',
    borderBottom: '2px solid #e2e8f0',
  },
  h1: { fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' },
  subtitle: { fontSize: '13px', color: '#64748b', margin: 0 },
  sectionTitle: {
    fontSize: '11px', fontWeight: '700', color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    marginBottom: '12px', marginTop: '24px',
  },
  legend: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' },
  dot: (color) => ({
    width: '10px', height: '10px', borderRadius: '50%',
    background: color, flexShrink: 0,
  }),
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: '24px' },
  th: (color) => ({
    padding: '10px 14px', fontWeight: '700', fontSize: '13px',
    background: '#f8fafc', borderBottom: '2px solid #e2e8f0',
    color: color || '#475569', textAlign: color ? 'center' : 'left',
  }),
  td: { padding: '10px 14px', fontSize: '13px', borderBottom: '1px solid #f1f5f9' },
  tdCenter: (bold) => ({
    padding: '10px 14px', fontSize: bold ? '15px' : '13px',
    fontWeight: bold ? '700' : '400',
    borderBottom: '1px solid #f1f5f9', textAlign: 'center', color: '#0f172a',
  }),
  tdDiff: (diff) => ({
    padding: '10px 14px', fontSize: '13px', fontWeight: '700',
    borderBottom: '1px solid #f1f5f9', textAlign: 'center',
    color: diff > 0 ? '#16a34a' : diff < 0 ? '#dc2626' : '#94a3b8',
  }),
  topicRow: {
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '10px 0', borderBottom: '1px solid #f1f5f9',
  },
  topicName: { width: '220px', flexShrink: 0, fontSize: '13px', fontWeight: '500', color: '#1e293b' },
  ratesWrap: { display: 'flex', gap: '20px', flex: 1, flexWrap: 'wrap' },
  rateItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  barTrack: { width: '80px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' },
  barFill: (pct, color) => ({
    height: '100%', width: `${Math.min(100, pct)}%`,
    background: color, borderRadius: '3px',
  }),
  pctLabel: { fontSize: '12px', fontWeight: '700', color: '#475569', width: '32px' },
};

function formatDate(iso) {
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(iso));
}

const METRICS = [
  { label: 'Dogru',        key: 'correctCount',   decimals: 0 },
  { label: 'Yanlis',       key: 'wrongCount',      decimals: 0 },
  { label: 'Bos',          key: 'blankCount',      decimals: 0 },
  { label: 'Min. Puan',    key: 'minimumScore',    decimals: 2 },
  { label: 'Tahmini Puan', key: 'estimatedScore',  decimals: 2 },
];

const PrintableComparison = forwardRef(({ exams }, ref) => {
  // Konu satırları: en az bir sınavda sorusu olan konular
  const allTopics = new Set();
  exams.forEach(e => {
    e.stats.topicBreakdown?.forEach(t => {
      if (t.total > 0) allTopics.add(t.topicName);
    });
  });
  const topicRows = [...allTopics].map(topicName => ({
    topicName,
    rates: exams.map(e => {
      const t = e.stats.topicBreakdown?.find(td => td.topicName === topicName);
      return { rate: t?.successRate ?? 0, total: t?.total ?? 0 };
    }),
  }));

  return (
    <div ref={ref} style={s.root}>
      <div style={s.header}>
        <h1 style={s.h1}>HMGS Sinav Karsilastirmasi</h1>
        <p style={s.subtitle}>
          {exams.length} sinav · {new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>

      {/* Renk açıklaması */}
      <div style={s.legend}>
        {exams.map((e, i) => (
          <div key={e.id} style={s.legendItem}>
            <span style={s.dot(BAR_COLORS[i % BAR_COLORS.length])} />
            <span style={{ fontWeight: '600' }}>{e.name}</span>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>{formatDate(e.savedAt)}</span>
          </div>
        ))}
      </div>

      {/* Metrik tablosu */}
      <div style={s.sectionTitle}>Genel Karsilastirma</div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th()}>Metrik</th>
            {exams.map((e, i) => (
              <th key={e.id} style={s.th(BAR_COLORS[i % BAR_COLORS.length])}>{e.name}</th>
            ))}
            {exams.length === 2 && <th style={s.th('#64748b')}>Fark</th>}
          </tr>
        </thead>
        <tbody>
          {METRICS.map(({ label, key, decimals }) => {
            const vals = exams.map(e => e.stats[key] ?? 0);
            const diff = exams.length === 2 ? vals[1] - vals[0] : null;
            return (
              <tr key={key}>
                <td style={s.td}>{label}</td>
                {vals.map((v, i) => (
                  <td key={i} style={s.tdCenter(true)}>
                    {decimals ? v.toFixed(decimals) : v}
                  </td>
                ))}
                {diff !== null && (
                  <td style={s.tdDiff(diff)}>
                    {diff > 0 ? '+' : ''}{decimals ? diff.toFixed(decimals) : diff}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Konu karşılaştırması */}
      {topicRows.length > 0 && (
        <>
          <div style={s.sectionTitle}>Konu Bazli Karsilastirma</div>
          <div>
            {topicRows.map(({ topicName, rates }) => {
              const diff = rates.length === 2 ? rates[1].rate - rates[0].rate : null;
              return (
                <div key={topicName} style={s.topicRow}>
                  <span style={s.topicName}>{topicName}</span>
                  <div style={s.ratesWrap}>
                    {rates.map((r, i) => (
                      <div key={i} style={s.rateItem}>
                        <span style={s.dot(BAR_COLORS[i % BAR_COLORS.length])} />
                        <div style={s.barTrack}>
                          <div style={s.barFill(r.rate, BAR_COLORS[i % BAR_COLORS.length])} />
                        </div>
                        <span style={s.pctLabel}>%{r.rate}</span>
                        {r.total > 0 && (
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>({r.total})</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {diff !== null && (
                    <span style={{ ...s.tdDiff(diff), padding: 0, width: '48px', textAlign: 'right', border: 'none' }}>
                      {diff > 0 ? '+' : ''}{diff}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
});

PrintableComparison.displayName = 'PrintableComparison';
export default PrintableComparison;
