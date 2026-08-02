import React, { useState, useEffect } from 'react';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Check,
  Send,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quiz, ExamAttempt, QuizQuestion } from '../types.js';

interface ExamModeViewProps {
  quiz: Quiz;
  onSubmitExam: (quizId: string, answers: Record<string, string>, timeSpentSeconds: number) => Promise<ExamAttempt>;
  onExitExam: () => void;
}

export function ExamModeView({
  quiz,
  onSubmitExam,
  onExitExam,
}: ExamModeViewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQIds, setFlaggedQIds] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<ExamAttempt | null>(null);

  // Timer countdown
  useEffect(() => {
    if (attemptResult || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [attemptResult, timeLeft]);

  const handleAutoSubmit = async () => {
    await handleSubmit();
  };

  const handleAnswerSelect = (qId: string, ans: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: ans }));
  };

  const toggleFlag = (qId: string) => {
    setFlaggedQIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const timeSpent = quiz.durationMinutes * 60 - timeLeft;

    try {
      const res = await onSubmitExam(quiz.id, userAnswers, timeSpent);
      setAttemptResult(res);
      if (res.percentage >= 70) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch (e: any) {
      alert('Exam submission error: ' + (e?.message || 'Error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ: QuizQuestion = quiz.questions[currentIdx];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (attemptResult) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-slate-900">
        {/* Results Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <Award size={36} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{attemptResult.quizTitle}</h1>
            <p className="text-xs text-slate-500">Examination Results & Automated Academic Evaluation</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Score</span>
              <p className="text-2xl font-bold text-slate-900">
                {attemptResult.score} / {attemptResult.maxScore}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Percentage</span>
              <p className={`text-2xl font-bold ${attemptResult.percentage >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {attemptResult.percentage}%
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Time Spent</span>
              <p className="text-2xl font-bold text-slate-900">{formatTime(attemptResult.timeSpentSeconds)}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Answered</span>
              <p className="text-2xl font-bold text-blue-600">
                {Object.keys(userAnswers).length} / {quiz.questions.length}
              </p>
            </div>
          </div>

          {/* Performance Analysis & Revision Recommendation */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-left space-y-3 max-w-3xl mx-auto text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <BookOpen size={16} className="text-blue-600" />
              <span>Academic Performance Analysis & Recommended Revision</span>
            </h3>

            <p className="text-slate-700 leading-relaxed">{attemptResult.recommendation}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg space-y-1">
                <span className="font-bold text-rose-700 text-[10px] uppercase">Weak Areas Identified:</span>
                <div className="flex flex-wrap gap-1">
                  {attemptResult.weakTopics.map((wt, idx) => (
                    <span key={idx} className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded font-semibold">
                      {wt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg space-y-1">
                <span className="font-bold text-emerald-700 text-[10px] uppercase">Strong Concepts:</span>
                <div className="flex flex-wrap gap-1">
                  {attemptResult.strongTopics.map((st, idx) => (
                    <span key={idx} className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-semibold">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={onExitExam}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-xs transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>

        {/* Question by Question Detailed Breakdown */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-slate-900">Detailed Answer Breakdown & Feedback</h2>
          {attemptResult.answers.map((ans, idx) => {
            const q = quiz.questions.find((item) => item.id === ans.questionId) || quiz.questions[idx];
            return (
              <div
                key={ans.questionId}
                className={`bg-white border rounded-xl p-5 space-y-3 text-xs shadow-xs ${
                  ans.isCorrect ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <span className="font-sans font-bold text-slate-400">Q{idx + 1}.</span>
                    <span className="font-bold text-slate-900 text-sm">{q?.question}</span>
                  </div>
                  <span
                    className={`font-sans font-bold px-2.5 py-1 rounded text-[11px] ${
                      ans.isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {ans.scoreEarned} / {ans.maxScore} Pts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Your Answer:</span>
                    <p className={`font-medium ${ans.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {ans.answerText || 'No answer submitted'}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Expected Model Answer:</span>
                    <p className="font-medium text-blue-700">{q?.correctAnswer}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">AI Academic Feedback:</span>
                  <p className="leading-relaxed text-slate-700">{ans.feedback || ans.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 text-slate-900 min-h-[calc(100vh-80px)] flex flex-col justify-between">
      {/* Top Bar: Exam Title, Timer, Flag */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block font-sans">
            EXAMINATION SESSION
          </span>
          <h2 className="font-bold text-slate-900 text-base truncate">{quiz.title}</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-amber-800 font-bold text-sm">
            <Clock size={16} />
            <span>Timer: {formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => toggleFlag(currentQ.id)}
            className={`p-2 rounded-lg border transition ${
              flaggedQIds.has(currentQ.id)
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title="Flag Question for Review"
          >
            <Flag size={16} />
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
            <span className="font-bold text-blue-600">
              Question {currentIdx + 1} of {quiz.questions.length}
            </span>
            <span className="uppercase text-[10px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-bold">
              Type: {currentQ.type}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">{currentQ.question}</h3>

          {/* Option Selection for MCQ / True False */}
          {currentQ.options && currentQ.options.length > 0 ? (
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = userAnswers[currentQ.id] === opt;
                return (
                  <div
                    key={oIdx}
                    onClick={() => handleAnswerSelect(currentQ.id, opt)}
                    className={`p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check size={18} className="text-blue-600" />}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700">
                Type your answer below (Evaluated by AI Assistant based on course materials):
              </label>
              <textarea
                rows={5}
                placeholder="Explain the concept in detail according to your lecture notes..."
                value={userAnswers[currentQ.id] || ''}
                onChange={(e) => handleAnswerSelect(currentQ.id, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Question Palette & Navigation */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5">
            {quiz.questions.map((q, idx) => {
              const isAns = !!userAnswers[q.id];
              const isCurrent = idx === currentIdx;
              const isFlagged = flaggedQIds.has(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center relative ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                      : isAns
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-200 transition"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            {currentIdx === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-xs transition"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>Submit Exam</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
                className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-xs transition"
              >
                <span>Next Question</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
