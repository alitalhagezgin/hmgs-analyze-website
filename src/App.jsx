import { useState, useEffect, useRef, useCallback } from 'react';
import { Scale, RotateCcw, BarChart2, AlertTriangle, X, BookOpen } from 'lucide-react';
import { useExamState } from './hooks/useExamState';
import { useTheme } from './hooks/useTheme';
import { useSavedExams } from './hooks/useSavedExams';
import { TOTAL_QUESTIONS } from './data/topics';
import ProgressBar from './components/ProgressBar';
import QuestionRow from './components/QuestionRow';
import TopicSidebar from './components/TopicSidebar';
import AnalysisView from './components/AnalysisView';
import SavedExamsView from './components/SavedExamsView';
import ExamDetailView from './components/ExamDetailView';
import ExamComparisonView from './components/ExamComparisonView';
import ThemeToggle from './components/ThemeToggle';

// 'exam' | 'analysis' | 'saved' | 'detail' | 'comparison'
const KEY_TO_STATUS = {
  '1': 'correct', '2': 'wrong', '3': 'near_correct',
  '4': 'near_wrong', '5': 'forgot', '6': 'blank',
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { savedExams, saveExam, deleteExam, renameExam, getExamById } = useSavedExams();
  const {
    questions, setQuestionStatus, setQuestionTopic,
    bulkAssignTopic, resetExam, loadExam, answeredCount, allAnswered,
  } = useExamState();

  const [view, setView]               = useState('exam');
  const [detailExamId, setDetailExamId]       = useState(null);
  const [comparisonIds, setComparisonIds]     = useState([]);
  const [activeQuestion, setActiveQuestion]   = useState(1);
  const [autoScroll, setAutoScroll]           = useState(true);
  const [showResetModal, setShowResetModal]   = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  const rowRefs = useRef([]);

  const scrollToQuestion = useCallback((num) => {
    const el = rowRefs.current[num - 1];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  useEffect(() => {
    if (view !== 'exam') return;
    function handleKey(e) {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const status = KEY_TO_STATUS[e.key];
      if (status) {
        const prev = questions[activeQuestion - 1]?.status;
        setQuestionStatus(activeQuestion, prev === status ? null : status);
        if (autoScroll && activeQuestion < TOTAL_QUESTIONS) {
          const next = activeQuestion + 1;
          setActiveQuestion(next);
          setTimeout(() => scrollToQuestion(next), 50);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = Math.min(activeQuestion + 1, TOTAL_QUESTIONS);
        setActiveQuestion(next); scrollToQuestion(next);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = Math.max(activeQuestion - 1, 1);
        setActiveQuestion(prev); scrollToQuestion(prev);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [view, activeQuestion, questions, autoScroll, setQuestionStatus, scrollToQuestion]);

  function handleShowAnalysis() {
    if (!allAnswered) { setShowIncompleteWarning(true); return; }
    setView('analysis');
  }

  function handleReset() {
    resetExam();
    setShowResetModal(false);
    setActiveQuestion(1);
    setView('exam');
  }

  function handleLoadExam(savedQuestions) {
    loadExam(savedQuestions);
    setView('exam');
    setActiveQuestion(1);
  }

  // ── Routing ──────────────────────────────────────────────

  if (view === 'analysis') {
    return (
      <AnalysisView
        questions={questions}
        onBack={() => setView('exam')}
        theme={theme}
        onSave={saveExam}
        savedExams={savedExams}
      />
    );
  }

  if (view === 'saved') {
    return (
      <SavedExamsView
        savedExams={savedExams}
        onBack={() => setView('exam')}
        onViewDetail={(id) => { setDetailExamId(id); setView('detail'); }}
        onCompare={(ids) => { setComparisonIds(ids); setView('comparison'); }}
        onDelete={deleteExam}
        onRename={renameExam}
      />
    );
  }

  if (view === 'detail' && detailExamId) {
    const exam = getExamById(detailExamId);
    if (!exam) { setView('saved'); return null; }
    return (
      <ExamDetailView
        exam={exam}
        onBack={() => setView('saved')}
        theme={theme}
        onLoadExam={handleLoadExam}
      />
    );
  }

  if (view === 'comparison' && comparisonIds.length >= 2) {
    const exams = comparisonIds.map(id => getExamById(id)).filter(Boolean);
    if (exams.length < 2) { setView('saved'); return null; }
    return (
      <ExamComparisonView
        exams={exams}
        onBack={() => setView('saved')}
        theme={theme}
      />
    );
  }

  // ── Ana soru ekranı ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="bg-indigo-700 dark:bg-indigo-900 text-white shadow-lg transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Scale size={22} className="text-indigo-200 shrink-0" />
          <div className="min-w-0">
            <h1 className="font-extrabold text-lg leading-none">HMGS</h1>
            <p className="text-indigo-300 text-xs hidden sm:block">Hukuk Mesleklerine Geçiş Sınavı — Analiz</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-indigo-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={e => setAutoScroll(e.target.checked)}
                className="accent-indigo-400"
              />
              <span className="hidden sm:inline">Otomatik kaydır</span>
            </label>
            <span className="text-xs text-indigo-300 hidden md:block">1-6: işaretle · ↑↓: soru değiştir</span>

            {/* Geçmiş Sınavlar */}
            <button
              onClick={() => setView('saved')}
              className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-200 hover:text-white border border-indigo-600 hover:border-indigo-400 rounded-lg transition-colors"
            >
              <BookOpen size={14} />
              <span className="hidden sm:inline">Geçmiş</span>
              {savedExams.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-400 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {savedExams.length > 9 ? '9+' : savedExams.length}
                </span>
              )}
            </button>

            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Ana içerik */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 flex gap-5">
        <main className="flex-1 min-w-0">
          <ProgressBar answeredCount={answeredCount} />
          <div className="space-y-2">
            {questions.map((q, i) => (
              <QuestionRow
                key={q.questionNumber}
                question={q}
                isActive={activeQuestion === q.questionNumber}
                rowRef={el => (rowRefs.current[i] = el)}
                onStatusChange={(num, status) => { setQuestionStatus(num, status); setActiveQuestion(num); }}
                onTopicChange={setQuestionTopic}
              />
            ))}
          </div>
        </main>

        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-4">
            <TopicSidebar questions={questions} onBulkAssign={bulkAssignTopic} />
          </div>
        </aside>
      </div>

      {/* Mobil sidebar */}
      <div className="lg:hidden px-4 pb-4">
        <TopicSidebar questions={questions} onBulkAssign={bulkAssignTopic} />
      </div>

      {/* Alt sabit bar */}
      <footer className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {answeredCount}/{TOTAL_QUESTIONS} işaretlendi
            {!allAnswered && <span className="text-orange-500 ml-1">· {TOTAL_QUESTIONS - answeredCount} eksik</span>}
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw size={14} />
              Sıfırla
            </button>
            <button
              onClick={handleShowAnalysis}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all ${
                allAnswered ? 'bg-indigo-600 hover:bg-indigo-700 shadow-sm' : 'bg-indigo-400 hover:bg-indigo-500'
              }`}
            >
              <BarChart2 size={14} />
              Analizi Göster
            </button>
          </div>
        </div>
      </footer>

      {/* Reset modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Sınavı Sıfırla</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
              Tüm işaretlemeler ve konu atamaları silinecek. Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetModal(false)} className="flex-1 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Vazgeç
              </button>
              <button onClick={handleReset} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Eksik soru uyarısı */}
      {showIncompleteWarning && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-amber-500" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-1">İşaretlenmemiş Sorular Var</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  <strong>{TOTAL_QUESTIONS - answeredCount} soru</strong> henüz işaretlenmedi. Analizi yine de görmek ister misiniz?
                </p>
              </div>
              <button onClick={() => setShowIncompleteWarning(false)} className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowIncompleteWarning(false)} className="flex-1 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Geri Dön
              </button>
              <button onClick={() => { setShowIncompleteWarning(false); setView('analysis'); }} className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors">
                Analizi Göster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
