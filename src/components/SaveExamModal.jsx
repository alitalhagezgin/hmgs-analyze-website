import { useState } from 'react';
import { Save, X, AlertTriangle } from 'lucide-react';

export default function SaveExamModal({ savedExams, defaultName, onSave, onClose }) {
  const [name, setName]   = useState(defaultName);
  const [notes, setNotes] = useState('');

  const duplicate = savedExams.some(e => e.name.trim() === name.trim());

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), notes.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Save size={18} className="text-indigo-500" />
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Sınavı Kaydet</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* İsim */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Sınav Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={80}
              placeholder="Örn: Deneme 1, Nisan Denemesi..."
              autoFocus
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 placeholder:text-slate-400"
            />
          </div>

          {/* Aynı isim uyarısı */}
          {duplicate && (
            <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2.5">
              <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Bu isimde bir sınav zaten kayıtlı. Yine de kaydedebilirsiniz.
              </p>
            </div>
          )}

          {/* Not alanı */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Not <span className="font-normal text-slate-400">(opsiyonel)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value.slice(0, 200))}
              rows={3}
              placeholder="Bu denemeyle ilgili notlarınız..."
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 placeholder:text-slate-400 resize-none"
            />
            <p className="text-xs text-slate-400 text-right mt-1">{notes.length}/200</p>
          </div>

          {/* Butonlar */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              <Save size={14} />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
