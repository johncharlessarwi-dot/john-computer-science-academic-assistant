export function gradeExactAnswers(answers: string[], expected: string[]): {correct: number; total: number; percent: number} {
  const total = expected.length;
  const correct = expected.filter((item,i) => (answers[i] || '').trim().toLowerCase() === item.trim().toLowerCase()).length;
  return {correct,total,percent:total ? Math.round(correct * 100 / total) : 0};
}
