import { forwardRef } from 'react';

const TOTAL = 120;

// Inline style nesneleri — Tailwind'e bağımlı değil, html2canvas güvenli
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
    marginBottom: '28px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e2e8f0',
  },
  h1: { fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' },
  subtitle: { fontSize: '13px', color: '#64748b', margin: 0 },
  sectionTitle: {
    fontSize: '11px', fontWeight: '700', color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    marginBottom: '12px', marginTop: '24px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px',
    marginBottom: '20px',
  },
  statCard: (bg, border) => ({
    background: bg, border: `1px solid ${border}`,
    borderRadius: '10px', padding: '14px 12px', textAlign: 'center',
  }),
  statLabel: {
    fontSize: '10px', fontWeight: '700', color: '#64748b',
    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px',
  },
  statValue: (color) => ({
    fontSize: '34px', fontWeight: '800', color, lineHeight: '1', marginBottom: '4px',
  }),
  statSub: { fontSize: '10px', color: '#94a3b8' },
  infoBox: {
    background: '#eff6ff', border: '1px solid #bfdbfe',
    borderRadius: '8px', padding: '12px 16px',
    fontSize: '12px', color: '#1e40af', lineHeight: '1.7',
    marginBottom: '20px',
  },
  topicsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  topicCard: {
    background: '#f8fafc', border: '1px solid #e2e8f0',
    borderRadius: '8px', padding: '12px',
  },
  topicHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '8px', gap: '6px',
  },
  topicName: { fontSize: '12px', fontWeight: '600', color: '#1e293b', lineHeight: '1.4' },
  topicCount: { fontSize: '11px', color: '#94a3b8', flexShrink: 0 },
  barTrack: {
    height: '5px', background: '#e2e8f0',
    borderRadius: '3px', overflow: 'hidden', marginBottom: '6px',
  },
  barFill: (pct) => ({
    height: '100%',
    width: `${Math.min(100, Math.round(pct))}%`,
    background: pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444',
    borderRadius: '3px',
  }),
  topicStats: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '10px', color: '#64748b',
  },
};

const PrintableAnalysis = forwardRef(({ stats, examName }, ref) => {
  const answered = stats.byTopic.filter(t => t.total > 0);

  return (
    <div ref={ref} style={s.root}>
      <div style={s.header}>
        <h1 style={s.h1}>HMGS Sınav Analizi</h1>
        <p style={s.subtitle}>
          {examName || 'Sınav'} · {new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>

      <div style={s.sectionTitle}>Genel Sonuç</div>
      <div style={s.statsRow}>
        <div style={s.statCard('#f0fdf4', '#bbf7d0')}>
          <div style={s.statLabel}>Dogru</div>
          <div style={s.statValue('#16a34a')}>{stats.correct}</div>
          <div style={s.statSub}>%{((stats.correct / TOTAL) * 100).toFixed(1)}</div>
        </div>
        <div style={s.statCard('#fef2f2', '#fecaca')}>
          <div style={s.statLabel}>Yanlis</div>
          <div style={s.statValue('#dc2626')}>{stats.wrong}</div>
          <div style={s.statSub}>%{((stats.wrong / TOTAL) * 100).toFixed(1)}</div>
        </div>
        <div style={s.statCard('#f8fafc', '#e2e8f0')}>
          <div style={s.statLabel}>Bos</div>
          <div style={s.statValue('#64748b')}>{stats.blank}</div>
          <div style={s.statSub}>Puana etki etmez</div>
        </div>
        <div style={s.statCard('#fffbeb', '#fde68a')}>
          <div style={s.statLabel}>Kararsis / Unuttu</div>
          <div style={s.statValue('#d97706')}>{stats.nearCorrect + stats.nearWrong + stats.forgot}</div>
          <div style={s.statSub}>
            {stats.nearCorrect} yakin D · {stats.nearWrong} yakin Y · {stats.forgot} unuttu
          </div>
        </div>
        <div style={s.statCard('#eef2ff', '#c7d2fe')}>
          <div style={s.statLabel}>Tahmini Puan</div>
          <div style={s.statValue('#4f46e5')}>{stats.estimatedScore.toFixed(2)}</div>
          <div style={s.statSub}>Min: {stats.minimumScore.toFixed(2)}</div>
        </div>
      </div>

      <div style={s.infoBox}>
        <strong>Puan Hesaplamasi:</strong> Puan = (Dogru Sayisi / 120) x 100
        {'  |  '}
        HMGS'de yanlis cevaplar dogruyu gotürmez.
        Kararsis cevaplar: dogruya yakin %70, yanlisa yakin %30 ihtimalle dogru sayildi.
      </div>

      {answered.length > 0 && (
        <>
          <div style={s.sectionTitle}>Konu Bazli Analiz</div>
          <div style={s.topicsGrid}>
            {answered.map(t => (
              <div key={t.topicName} style={s.topicCard}>
                <div style={s.topicHeader}>
                  <span style={s.topicName}>{t.topicName}</span>
                  <span style={s.topicCount}>{t.total} soru</span>
                </div>
                <div style={s.barTrack}>
                  <div style={s.barFill(t.successRate)} />
                </div>
                <div style={s.topicStats}>
                  <span>Basari: %{t.successRate}</span>
                  <span>D:{t.correct} Y:{t.wrong} ?:{t.nearCorrect + t.nearWrong} B:{t.blank}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

PrintableAnalysis.displayName = 'PrintableAnalysis';
export default PrintableAnalysis;
