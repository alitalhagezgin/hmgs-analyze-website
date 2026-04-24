import { useState, useEffect, useCallback } from 'react';
import { TOTAL_QUESTIONS, getDefaultTopicForQuestion } from '../data/topics';

const STORAGE_KEY = 'hmgs_exam_state';

function buildInitialQuestions() {
  return Array.from({ length: TOTAL_QUESTIONS }, (_, i) => ({
    questionNumber: i + 1,
    status: null,
    topic: getDefaultTopicForQuestion(i + 1),
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

export function useExamState() {
  const [questions, setQuestions] = useState(() => {
    const saved = loadFromStorage();
    return saved?.questions ?? buildInitialQuestions();
  });

  const [startedAt, setStartedAt] = useState(() => {
    const saved = loadFromStorage();
    return saved?.startedAt ?? new Date().toISOString();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ questions, startedAt }));
    } catch {}
  }, [questions, startedAt]);

  const setQuestionStatus = useCallback((questionNumber, status) => {
    setQuestions(prev =>
      prev.map(q => q.questionNumber === questionNumber ? { ...q, status } : q)
    );
  }, []);

  const setQuestionTopic = useCallback((questionNumber, topic) => {
    setQuestions(prev =>
      prev.map(q => q.questionNumber === questionNumber ? { ...q, topic } : q)
    );
  }, []);

  const bulkAssignTopic = useCallback((from, to, topic) => {
    setQuestions(prev =>
      prev.map(q =>
        q.questionNumber >= from && q.questionNumber <= to ? { ...q, topic } : q
      )
    );
  }, []);

  const resetExam = useCallback(() => {
    const fresh = buildInitialQuestions();
    const now = new Date().toISOString();
    setQuestions(fresh);
    setStartedAt(now);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Kaydedilmiş bir sınavı aktif sınav olarak yükle
  const loadExam = useCallback((savedQuestions) => {
    setQuestions(savedQuestions);
    setStartedAt(new Date().toISOString());
  }, []);

  const answeredCount = questions.filter(q => q.status !== null).length;
  const allAnswered   = answeredCount === TOTAL_QUESTIONS;

  return {
    questions,
    startedAt,
    setQuestionStatus,
    setQuestionTopic,
    bulkAssignTopic,
    resetExam,
    loadExam,
    answeredCount,
    allAnswered,
  };
}
