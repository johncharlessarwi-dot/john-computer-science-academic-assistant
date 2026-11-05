export function gradeExactAnswers(answers: string[], expected: string[]): {correct: number; total: number; percent: number} {
  const total = expected.length;
  const correct = expected.filter((item, i) => {
    const target = item.trim().toLowerCase();
    const response = (answers[i] || '').trim().toLowerCase();
    // Unanswered questions and missing answer keys never earn marks.
    return target.length > 0 && response.length > 0 && response === target;
  }).length;
  return { correct, total, percent: total ? Math.round(correct * 100 / total) : 0 };
}
