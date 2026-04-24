import { useState, useEffect, useCallback } from 'react';
import { computeAnalytics } from '../utils/analytics';

const STORAGE_KEY = 'hmgs-saved-exams';

function loadExams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useSavedExams() {
  const [savedExams, setSavedExams] = useState(loadExams);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedExams));
    } catch {}
  }, [savedExams]);

  const saveExam = useCallback((name, questions, notes = '') => {
    const stats = computeAnalytics(questions);
    const exam = {
      id: `exam_${Date.now()}`,
      name: name.trim() || 'İsimsiz Sınav',
      notes,
      savedAt: new Date().toISOString(),
      questions,
      stats: {
        correctCount:     stats.correct,
        wrongCount:       stats.wrong,
        nearCorrectCount: stats.nearCorrect,
        nearWrongCount:   stats.nearWrong,
        forgotCount:      stats.forgot,
        blankCount:       stats.blank,
        minimumScore:     stats.minimumScore,
        estimatedScore:   stats.estimatedScore,
        topicBreakdown:   stats.byTopic,
      },
    };
    setSavedExams(prev => [exam, ...prev]);
    return exam.id;
  }, []);

  const deleteExam = useCallback((id) => {
    setSavedExams(prev => prev.filter(e => e.id !== id));
  }, []);

  const renameExam = useCallback((id, name) => {
    setSavedExams(prev =>
      prev.map(e => e.id === id ? { ...e, name: name.trim() || e.name } : e)
    );
  }, []);

  const getExamById = useCallback((id) => {
    return savedExams.find(e => e.id === id) ?? null;
  }, [savedExams]);

  return { savedExams, saveExam, deleteExam, renameExam, getExamById };
}
