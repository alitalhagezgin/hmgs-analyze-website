import { useRef, useState } from 'react';
import { ArrowLeft, FileText, Image, Loader2, Upload, AlertTriangle } from 'lucide-react';
import { computeAnalytics } from '../utils/analytics';
import { exportToPDF, exportToPNG } from '../utils/exportHelpers';
import AnalysisContent from './AnalysisContent';

function formatDate(iso) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

export default function ExamDetailView({ exam, onBack, theme, onLoadExam }) {
  const stats      = computeAnalytics(exam.questions);
  const contentRef = useRef(null);

  const [exporting, setExporting]       = useState(null);
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);

  async function handleExport(type) {
    setExporting(type);
    try {
      const slug = exam.name.replace(/\s+/g, '-');
      if (type === 'pdf') await exportToPDF(contentRef, `HMGS-${slug}.pdf`);
      else                await exportToPNG(contentRef, `HMGS-${slug}.png`);
    } finally {
      setExporting(null);
    }
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

          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{exam.name}</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(exam.savedAt)}</p>
          </div>

          {stats.unassignedCount > 0 && (
            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium px-2 py-1 rounded-full">
              {stats.unassignedCount} konu atanmamış
            </span>
          )}

          <div className="ml-auto flex items-center gap-2 flex-wrap">
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
            <button
              onClick={() => setShowLoadConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <Upload size={14} />
              Bu Sınavı Yükle
            </button>
          </div>
        </div>

        {/* Not varsa göster */}
        {exam.notes && (
          <div className="max-w-6xl mx-auto px-4 pb-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">{exam.notes}</p>
          </div>
        )}
      </div>

      <AnalysisContent stats={stats} theme={theme} contentRef={contentRef} />

      {/* Yükleme onay modal */}
      {showLoadConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-amber-500" />
              </div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Sınavı Yükle</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
              <strong>{exam.name}</strong> sınavı aktif sınav olarak yüklenecek.
              Üzerinde çalıştığınız mevcut sınav silinecek. Devam etmek istiyor musunuz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoadConfirm(false)}
                className="flex-1 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => { onLoadExam(exam.questions); setShowLoadConfirm(false); }}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
              >
                Yükle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
