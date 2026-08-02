import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  GraduationCap,
  BookOpen,
  Brain,
  CheckCircle2,
  HelpCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Course, ExplanationLevel } from '../types.js';

interface StudyModeViewProps {
  courses: Course[];
  userLevel?: ExplanationLevel;
  onSendMessage: (conversationId: string, prompt: string, courseId?: string) => Promise<void>;
}

export function StudyModeView({
  courses,
  userLevel = 'University Level',
}: StudyModeViewProps) {
  const [level, setLevel] = useState<ExplanationLevel>(userLevel);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [topic, setTopic] = useState('');
  const [sessionMessages, setSessionMessages] = useState<
    { role: 'tutor' | 'student'; text: string; time: string }[]
  >([
    {
      role: 'tutor',
      text: `Hello! I am your Socratic AI Computer Science Tutor. I am configured at the **${level}** explanation depth.\n\nLet's study together! Tell me what topic you would like to master today (e.g., CPU Cache, Virtual Memory, Recursion, Sorting Algorithms).`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const studentMsg = input;
    setInput('');

    setSessionMessages((prev) => [
      ...prev,
      {
        role: 'student',
        text: studentMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setIsLoading(true);

    try {
      const course = courses.find((c) => c.id === selectedCourseId);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'user_john_1',
        },
        body: JSON.stringify({
          prompt: `[STUDY MODE TUTOR SESSION - Depth: ${level}]
Course Context: ${course ? course.code + ' ' + course.name : 'Computer Science'}
Current Topic: ${topic || 'Core CS Concept'}
Student Input: ${studentMsg}

Instruct as an encouraging Socratic CS Tutor. Explain clearly at the ${level} level, ask 1 follow-up check question to test the student's understanding, and provide helpful hints.`,
          courseId: selectedCourseId,
        }),
      });

      const data = await res.json();
      const aiReply = data.message?.content || 'I evaluated your answer. Let us continue to the next concept!';

      setSessionMessages((prev) => [
        ...prev,
        {
          role: 'tutor',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setSessionMessages((prev) => [
        ...prev,
        {
          role: 'tutor',
          text: 'Error connecting to Study Tutor session. Please check your internet connection.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="text-blue-600" />
            <span>Socratic Study Mode Tutor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Interactive, step-by-step tutoring where the AI guides your reasoning, corrects misconceptions, and quizzes you.
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex items-center space-x-2 bg-white border border-slate-200 p-2 rounded-xl text-xs shadow-xs">
          <GraduationCap size={16} className="text-blue-600" />
          <span className="text-slate-600 font-semibold">Depth:</span>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as ExplanationLevel)}
            className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-2 py-1 focus:outline-none"
          >
            <option value="Beginner">Beginner (Simple & Intuitive)</option>
            <option value="Intermediate">Intermediate (Core Logic)</option>
            <option value="Advanced">Advanced (Rigorous Details)</option>
            <option value="University Level">University Level (Exam Spec)</option>
          </select>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-[520px] shadow-sm overflow-hidden">
        {/* Tutor Stream Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          {sessionMessages.map((m, idx) => {
            const isTutor = m.role === 'tutor';
            return (
              <div key={idx} className={`flex space-x-3 ${isTutor ? 'justify-start' : 'justify-end'}`}>
                {isTutor && (
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs">
                    T
                  </div>
                )}
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm max-w-xl whitespace-pre-wrap leading-relaxed ${
                    isTutor
                      ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                      : 'bg-blue-600 text-white rounded-tr-none font-medium shadow-xs'
                  }`}
                >
                  {m.text}
                  <span className={`block text-[9px] mt-2 text-right ${isTutor ? 'text-slate-400' : 'text-blue-100'}`}>{m.time}</span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-blue-600 font-medium">
              <Loader2 size={16} className="animate-spin" />
              <span>Socratic Tutor is evaluating and composing the next concept step...</span>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSend} className="relative flex items-center max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Type your answer, ask for a hint, or suggest a concept to study..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition shadow-xs"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
