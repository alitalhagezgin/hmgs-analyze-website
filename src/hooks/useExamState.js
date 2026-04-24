import { useState, useEffect, useCallback } from 'react';
import { TOTAL_QUESTIONS } from '../data/topics';

const STORAGE_KEY = 'hmgs_exam_state';

function buildInitialQuestions() {
  return Array.from({ length: TOTAL_QUESTIONS }, (_, i) => ({
    questionNumber: i + 1,
    status: null,
    topic: null,
  }));
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage dolu olabilir, sessizce geç
  }
}

export function useExamState() {
  const [questions, setQuestions] = useState(() => {
    const saved = loadFromStorage();
    return saved?.questions ?? buildInitialQuestions();
  });
  const [startedAt] = useState(() => {
    const saved = loadFromStorage();
    return saved?.startedAt ?? new Date().toISOString();
  });
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Her değişiklikte localStorage'a yaz
  useEffect(() => {
    saveToStorage({ questions, startedAt });
  }, [questions, startedAt]);

  const setQuestionStatus = useCallback((questionNumber, status) => {
    setQuestions(prev =>
      prev.map(q =>
        q.questionNumber === questionNumber ? { ...q, status } : q
      )
    );
  }, []);

  const setQuestionTopic = useCallback((questionNumber, topic) => {
    setQuestions(prev =>
      prev.map(q =>
        q.questionNumber === questionNumber ? { ...q, topic } : q
      )
    );
  }, []);

  // Aralıktaki sorulara toplu konu atama
  const bulkAssignTopic = useCallback((from, to, topic) => {
    setQuestions(prev =>
      prev.map(q =>
        q.questionNumber >= from && q.questionNumber <= to
          ? { ...q, topic }
          : q
      )
    );
  }, []);

  const resetExam = useCallback(() => {
    const fresh = buildInitialQuestions();
    setQuestions(fresh);
    setShowAnalysis(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const answeredCount = questions.filter(q => q.status !== null).length;
  const allAnswered = answeredCount === TOTAL_QUESTIONS;

  return {
    questions,
    startedAt,
    showAnalysis,
    setShowAnalysis,
    setQuestionStatus,
    setQuestionTopic,
    bulkAssignTopic,
    resetExam,
    answeredCount,
    allAnswered,
  };
}
