import { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function NetExplanation({ minNet, estimatedNet }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-2xl overflow-hidden transition-colors duration-200">
      {/* Başlık / toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left"
      >
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
          <Info size={16} className="shrink-0" />
          <span>Net Nasıl Hesaplandı?</span>
          <span className="ml-2 text-indigo-500 dark:text-indigo-400 font-normal text-xs">
            Min: <strong>{minNet.toFixed(2)}</strong>
            {' '}· Tahmini: <strong>{estimatedNet.toFixed(2)}</strong>
          </span>
        </div>
        {open
          ? <ChevronUp size={16} className="text-indigo-400 shrink-0" />
          : <ChevronDown size={16} className="text-indigo-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 text-sm text-slate-700 dark:text-slate-300 border-t border-indigo-200 dark:border-indigo-700 pt-4">
          {/* İki net yan yana */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Minimum Net</p>
              <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{minNet.toFixed(2)}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Yalnızca kesin doğru/yanlış</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Tahmini Net</p>
              <p className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400">{estimatedNet.toFixed(2)}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Kararsızlar dahil</p>
            </div>
          </div>

          {/* Formül */}
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">📊 Formül</p>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 font-mono text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <p>Net = Doğru − (Yanlış ÷ 4)</p>
            </div>
          </div>

          {/* Kararsız hesabı */}
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Kararsız Cevaplar (Olasılıkla)</p>
            <div className="space-y-1.5">
              {[
                { emoji: '🟢', label: 'Doğruya yakın kararsız', detail: '%70 ihtimalle doğru, %30 yanlış' },
                { emoji: '🔴', label: 'Yanlışa yakın kararsız', detail: '%30 ihtimalle doğru, %70 yanlış' },
                { emoji: '❓', label: 'Hatırlamıyorum',         detail: 'Nete etki etmez' },
                { emoji: '⚪', label: 'Boş bıraktım',           detail: 'Nete etki etmez' },
              ].map(({ emoji, label, detail }) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="text-base shrink-0">{emoji}</span>
                  <div>
                    <span className="font-medium">{label}</span>
                    <span className="text-slate-400 dark:text-slate-500"> → {detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 italic border-t border-indigo-100 dark:border-indigo-800 pt-3">
            Bu yalnızca bir tahmindir. Sınav sonuçlarınızla farklılık gösterebilir.
          </p>
        </div>
      )}
    </div>
  );
}
