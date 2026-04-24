import { TOPICS } from '../data/topics';

const TOTAL = 120;

function round2(n) {
  return Math.round(n * 100) / 100;
}

export function computeAnalytics(questions) {
  const total       = questions.length;
  const correct     = questions.filter(q => q.status === 'correct').length;
  const wrong       = questions.filter(q => q.status === 'wrong').length;
  const nearCorrect = questions.filter(q => q.status === 'near_correct').length;
  const nearWrong   = questions.filter(q => q.status === 'near_wrong').length;
  const forgot      = questions.filter(q => q.status === 'forgot').length;
  const blank       = questions.filter(q => q.status === 'blank').length;
  const unanswered  = questions.filter(q => q.status === null).length;

  // Minimum puan: yalnızca kesin doğrular (yanlış puana etki etmez)
  const minimumScore = (correct / TOTAL) * 100;

  // Tahmini puan: kararsızları olasılıkla dahil et
  // near_correct → %70 ihtimalle doğru
  // near_wrong   → %30 ihtimalle doğru
  // wrong / forgot / blank → puana etki etmez
  const estimatedCorrect = correct + nearCorrect * 0.7 + nearWrong * 0.3;
  const estimatedScore   = (estimatedCorrect / TOTAL) * 100;

  const byTopic = TOPICS.map(topicName => {
    const topicQs      = questions.filter(q => q.topic === topicName);
    const tCorrect     = topicQs.filter(q => q.status === 'correct').length;
    const tWrong       = topicQs.filter(q => q.status === 'wrong').length;
    const tNearCorrect = topicQs.filter(q => q.status === 'near_correct').length;
    const tNearWrong   = topicQs.filter(q => q.status === 'near_wrong').length;
    const tForgot      = topicQs.filter(q => q.status === 'forgot').length;
    const tBlank       = topicQs.filter(q => q.status === 'blank').length;
    const tTotal       = topicQs.length;
    const successRate  = tTotal > 0 ? Math.round((tCorrect / tTotal) * 100) : 0;

    return {
      topicName,
      total: tTotal,
      correct: tCorrect,
      wrong: tWrong,
      nearCorrect: tNearCorrect,
      nearWrong: tNearWrong,
      forgot: tForgot,
      blank: tBlank,
      successRate,
    };
  });

  const unassignedCount = questions.filter(q => q.topic === null).length;

  return {
    total,
    correct,
    wrong,
    nearCorrect,
    nearWrong,
    forgot,
    blank,
    unanswered,
    minimumScore:  round2(minimumScore),
    estimatedScore: round2(estimatedScore),
    byTopic,
    unassignedCount,
  };
}
