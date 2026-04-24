import { useRef, useState } from 'react';
import { ArrowLeft, FileText, Image, Loader2, Save, CheckCircle2 } from 'lucide-react';
import { computeAnalytics } from '../utils/analytics';
import { exportToPDF, exportToPNG } from '../utils/exportHelpers';
import AnalysisContent from './AnalysisContent';
import SaveExamModal from './SaveExamModal';

export default function AnalysisView({ questions, onBack, theme, onSave, savedExams = [] }) {
  const stats      = computeAnalytics(questions);
  const contentRef = useRef(null);

  const [exporting, setExporting]       = useState(null); // 'pdf' | 'png' | null
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedName, setSavedName]        = useState(null); // null = belgesiz, string = kayıtlı isim

  const defaultSaveName = `Deneme ${savedExams.length + 1}`;

  async function handleExport(type) {
    setExporting(type);
    try {
      const today = new Date().toISOString().slice(0, 10);
      if (type === 'pdf') await exportToPDF(contentRef, `HMGS-Analiz-${today}.pdf`);
      else                await exportToPNG(contentRef, `HMGS-Analiz-${today}.png`);
    } finally {
      setExporting(null);
    }
  }

  function handleSave(name, notes) {
    onSave?.(name, questions, notes);
    setSavedName(name);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Sticky üst bar (export dışı) */}
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

          <div className="ml-auto flex items-center gap-2 flex-wrap">
            {/* Export */}
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

            {/* Kaydet */}
            {onSave && (
              savedName ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <CheckCircle2 size={14} />
                  Kaydedildi: {savedName}
                </span>
              ) : (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  <Save size={14} />
                  Kaydet
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <AnalysisContent stats={stats} theme={theme} contentRef={contentRef} />

      {showSaveModal && (
        <SaveExamModal
          savedExams={savedExams}
          defaultName={defaultSaveName}
          onSave={handleSave}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}
