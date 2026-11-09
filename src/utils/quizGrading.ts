export function gradeExactAnswers(answers: string[], expected: string[]): {correct: number; total: number; percent: number} {
  if (!Array.isArray(answers) || !Array.isArray(expected)) throw new TypeError('Answers must be arrays');
  if (!answers.every(x=>typeof x==='string') || !expected.every(x=>typeof x==='string')) throw new TypeError('Answer entries must be text');
  const total = expected.length;
  const correct = expected.filter((item, i) => {
    const target = item.trim().toLowerCase();
    const response = (answers[i] || '').trim().toLowerCase();
    // Unanswered questions and missing answer keys never earn marks.
    return target.length > 0 && response.length > 0 && response === target;
  }).length;
  return { correct, total, percent: total ? Math.round(correct * 100 / total) : 0 };
}
