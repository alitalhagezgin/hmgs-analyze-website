import { useState } from 'react';
import {
  ArrowLeft, BookOpen, Trash2, Eye, Pencil, Check, X,
  GitCompare, AlertTriangle, ClipboardList,
} from 'lucide-react';

const MAX_COMPARE = 5;

function formatDate(iso) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

function ScoreMini({ score }) {
  const pct = Math.min(100, score);
  const color = score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-indigo-500' : score >= 30 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-10 text-right">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

function RenameInline({ currentName, onRename, onCancel }) {
  const [val, setVal] = useState(currentName);
  return (
    <form
      onSubmit={e => { e.preventDefault(); if (val.trim()) onRename(val.trim()); }}
      className="flex gap-2"
    >
      <input
        autoFocus
        value={val}
        onChange={e => setVal(e.target.value)}
        maxLength={80}
        className="flex-1 text-sm px-2 py-1 border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      <button type="submit" disabled={!val.trim()} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
        <Check size={16} />
      </button>
      <button type="button" onClick={onCancel} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
        <X size={16} />
      </button>
    </form>
  );
}

export default function SavedExamsView({
  savedExams, onBack, onViewDetail, onCompare,
  onDelete, onRename,
}) {
  const [compareMode, setCompareMode]   = useState(false);
  const [selected, setSelected]         = useState(new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [renamingId, setRenamingId]     = useState(null);

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_COMPARE) next.add(id);
      return next;
    });
  }

  function handleCompare() {
    if (selected.size >= 2) onCompare([...selected]);
  }

  function handleDelete() {
    if (deleteTarget) {
      onDelete(deleteTarget);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Üst bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft size={18} />
            Ana Sayfa
          </button>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-slate-500 dark:text-slate-400" />
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Geçmiş Sınavlar</h1>
            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-full">
              {savedExams.length}
            </span>
          </div>

          {savedExams.length >= 2 && (
            <div className="ml-auto flex items-center gap-3">
              {compareMode && selected.size >= 2 && (
                <button
                  onClick={handleCompare}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <GitCompare size={14} />
                  {selected.size} Sınavı Karşılaştır
                </button>
              )}
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                <div
                  onClick={() => { setCompareMode(v => !v); setSelected(new Set()); }}
                  className={`relative w-10 h-5 rounded-full transition-colors ${compareMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${compareMode ? 'translate-x-5' : ''}`} />
                </div>
                Karşılaştırma Modu
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Boş durum */}
        {savedExams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-5">
              <ClipboardList size={36} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Henüz kaydedilmiş sınav yok</h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs">
              İlk sınavınızı analiz ettikten sonra "Kaydet" butonuyla buraya ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <>
            {compareMode && (
              <div className="mb-4 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl text-sm text-indigo-700 dark:text-indigo-300">
                Karşılaştırmak istediğiniz sınavları seçin (2–{MAX_COMPARE} sınav).
                {selected.size >= MAX_COMPARE && ' Maksimum sınava ulaştınız.'}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {savedExams.map(exam => {
                const isSelected = selected.has(exam.id);
                const isRenaming = renamingId === exam.id;
                return (
                  <div
                    key={exam.id}
                    className={`bg-white dark:bg-slate-800 border rounded-2xl p-5 shadow-sm transition-all duration-150 ${
                      isSelected
                        ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      {compareMode && (
                        <button
                          onClick={() => toggleSelect(exam.id)}
                          disabled={!isSelected && selected.size >= MAX_COMPARE}
                          className={`mt-0.5 w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600'
                              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 disabled:opacity-30'
                          }`}
                        >
                          {isSelected && <Check size={12} className="text-white" />}
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        {isRenaming ? (
                          <RenameInline
                            currentName={exam.name}
                            onRename={name => { onRename(exam.id, name); setRenamingId(null); }}
                            onCancel={() => setRenamingId(null)}
                          />
                        ) : (
                          <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">{exam.name}</h3>
                        )}
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formatDate(exam.savedAt)}</p>
                        {exam.notes && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{exam.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* İstatistik özeti */}
                    <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-300 mb-3">
                      <span>✅ {exam.stats.correctCount}</span>
                      <span>❌ {exam.stats.wrongCount}</span>
                      <span>⚪ {exam.stats.blankCount}</span>
                    </div>

                    {/* Puan bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span>Tahmini Puan</span>
                      </div>
                      <ScoreMini score={exam.stats.estimatedScore} />
                    </div>

                    {/* Butonlar */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewDetail(exam.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                      >
                        <Eye size={13} />
                        Detay
                      </button>
                      <button
                        onClick={() => setRenamingId(exam.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        title="Yeniden adlandır"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(exam.id)}
                        className="p-2 text-red-400 hover:text-red-600 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Silme onay modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Sınavı Sil</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
              <strong>{savedExams.find(e => e.id === deleteTarget)?.name}</strong> sınavını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
