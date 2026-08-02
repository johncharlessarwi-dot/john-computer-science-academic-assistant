import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  ArrowRight,
  Brain
} from 'lucide-react';
import { AnalyticsData, ExamAttempt, Course } from '../types.js';

interface AnalyticsViewProps {
  analytics: AnalyticsData | null;
  attempts: ExamAttempt[];
  courses: Course[];
  setActiveTab: (tab: string) => void;
}

export function AnalyticsView({
  analytics,
  attempts,
  courses,
  setActiveTab,
}: AnalyticsViewProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <BarChart3 className="text-blue-600" />
          <span>Academic Analytics & Learning Progress</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track your computer science mastery, identify knowledge gaps, and view exam performance history.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Overall Accuracy</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{analytics?.averageScore || 82}%</p>
          <p className="text-[10px] text-slate-500">Based on recent exam submissions</p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Questions Solved</span>
            <Award size={16} className="text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{analytics?.questionsPracticed || 18}</p>
          <p className="text-[10px] text-slate-500">Practice & exam questions</p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Study Time</span>
            <Clock size={16} className="text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{analytics?.studyTimeHours || 14.5}h</p>
          <p className="text-[10px] text-slate-500">Active RAG AI sessions</p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Courses</span>
            <BookOpen size={16} className="text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{analytics?.totalCourses || courses.length}</p>
          <p className="text-[10px] text-slate-500">Enrolled CS Modules</p>
        </div>
      </div>

      {/* Weak vs Strong Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-3">
          <h2 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <AlertTriangle size={18} className="text-rose-600" />
            <span>Topics Requiring Revision (Weak Areas)</span>
          </h2>

          <div className="space-y-2">
            {analytics?.weakTopics.map((wt, idx) => (
              <div key={idx} className="flex items-center justify-between bg-rose-50/50 p-3 rounded-lg border border-rose-100 text-xs">
                <span className="font-semibold text-rose-900">{wt}</span>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200 text-[10px] font-bold px-2.5 py-1 rounded transition"
                >
                  Practice Questions →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Strong Topics */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-3">
          <h2 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>Mastered Concepts (Strong Areas)</span>
          </h2>

          <div className="space-y-2">
            {analytics?.strongTopics.map((st, idx) => (
              <div key={idx} className="flex items-center justify-between bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 text-xs">
                <span className="font-semibold text-emerald-900">{st}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  ✓ High Accuracy
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exam History Timeline */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
        <h2 className="font-bold text-slate-900 text-base flex items-center space-x-2">
          <Clock size={18} className="text-blue-600" />
          <span>Recent Exam Attempts History</span>
        </h2>

        <div className="space-y-2.5">
          {attempts.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No exam attempts submitted yet.</p>
          ) : (
            attempts.map((att) => (
              <div
                key={att.id}
                className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-sm">{att.quizTitle}</span>
                  <div className="flex items-center space-x-3 text-slate-500 text-[11px]">
                    <span>Score: {att.score}/{att.maxScore}</span>
                    <span>•</span>
                    <span>Time Spent: {Math.floor(att.timeSpentSeconds / 60)} mins</span>
                    <span>•</span>
                    <span>Submitted: {new Date(att.completedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span
                    className={`text-sm font-extrabold px-3 py-1 rounded ${
                      att.percentage >= 70
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {att.percentage}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
