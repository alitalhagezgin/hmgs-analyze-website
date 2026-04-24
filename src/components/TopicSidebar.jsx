import { useState } from 'react';
import { TOPICS, TOTAL_QUESTIONS } from '../data/topics';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

export default function TopicSidebar({ questions, onBulkAssign }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [expanded, setExpanded] = useState(true);

  function handleAssign() {
    const f = parseInt(from, 10);
    const t = parseInt(to, 10);
    if (!selectedTopic || isNaN(f) || isNaN(t)) return;
    if (f < 1 || t > TOTAL_QUESTIONS || f > t) return;
    onBulkAssign(f, t, selectedTopic);
    setFrom('');
    setTo('');
    setSelectedTopic('');
  }

  const topicCounts = TOPICS.reduce((acc, t) => {
    acc[t] = questions.filter(q => q.topic === t).length;
    return acc;
  }, {});

  const unassigned = questions.filter(q => q.topic === null).length;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden transition-colors duration-200">
      {/* Header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 dark:bg-indigo-900/40 border-b border-indigo-100 dark:border-indigo-800"
      >
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
          <Layers size={16} />
          Hızlı Konu Atama
        </div>
        {expanded
          ? <ChevronUp size={16} className="text-indigo-400" />
          : <ChevronDown size={16} className="text-indigo-400" />}
      </button>

      {expanded && (
        <div className="p-4 space-y-3">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={from}
              onChange={e => setFrom(e.target.value)}
              placeholder="Başlangıç"
              min={1}
              max={TOTAL_QUESTIONS}
              className="w-full text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <span className="text-slate-400 text-sm shrink-0">–</span>
            <input
              type="number"
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="Bitiş"
              min={1}
              max={TOTAL_QUESTIONS}
              className="w-full text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <select
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            className="w-full text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700"
          >
            <option value="">— Konu seç —</option>
            {TOPICS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button
            onClick={handleAssign}
            disabled={!selectedTopic || !from || !to}
            className="w-full py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Toplu Ata
          </button>

          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            Örnek: 1–30 arası → Anayasa Hukuku
          </p>
        </div>
      )}

      {/* Konu özeti */}
      <div className="border-t border-slate-100 dark:border-slate-700 p-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Konu Dağılımı</p>
        <div className="space-y-1.5">
          {TOPICS.map(t => (
            <div key={t} className="flex justify-between items-center">
              <span className="text-xs text-slate-600 dark:text-slate-300 truncate pr-2">{t}</span>
              <span className={`text-xs font-bold shrink-0 ${topicCounts[t] > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'}`}>
                {topicCounts[t]}
              </span>
            </div>
          ))}
          {unassigned > 0 && (
            <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 dark:text-slate-500">Atanmamış</span>
              <span className="text-xs font-bold text-orange-400">{unassigned}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
