import React, { useState } from 'react';
import {
  GraduationCap,
  UserCheck,
  Save,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { User, ExplanationLevel } from '../types.js';

interface ProfileViewProps {
  user: User | null;
  onUpdateProfile: (userData: Partial<User>) => Promise<void>;
}

export function ProfileView({ user, onUpdateProfile }: ProfileViewProps) {
  const [name, setName] = useState(user?.name || 'John CS Student');
  const [university, setUniversity] = useState(user?.university || 'Department of Computer Science');
  const [program, setProgram] = useState(user?.program || 'B.Sc. Computer Science');
  const [academicYear, setAcademicYear] = useState(user?.academicYear || 'Year 3');
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>(
    user?.explanationLevel || 'University Level'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateProfile({
        name,
        university,
        program,
        academicYear,
        explanationLevel,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e: any) {
      alert('Error updating profile: ' + (e?.message || 'Error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl mx-auto text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <GraduationCap className="text-blue-600" />
          <span>Academic Profile & AI Preferences</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure your computer science degree level, university details, and preferred AI explanation depth.
        </p>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Profile and AI explanation preferences updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">University / Institution</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Degree Program</label>
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Academic Year</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Year 1">Year 1 (Freshman)</option>
              <option value="Year 2">Year 2 (Sophomore)</option>
              <option value="Year 3">Year 3 (Junior)</option>
              <option value="Year 4">Year 4 (Senior)</option>
              <option value="Postgraduate / Masters">Postgraduate / Masters</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Preferred AI Explanation Depth</label>
            <select
              value={explanationLevel}
              onChange={(e) => setExplanationLevel(e.target.value as ExplanationLevel)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Beginner">Beginner (Simple & Intuitive Analogies)</option>
              <option value="Intermediate">Intermediate (Standard CS Logic)</option>
              <option value="Advanced">Advanced (Algorithms & Technical Specs)</option>
              <option value="University Level">University Level (Strict Midterm & Final Exam Format)</option>
            </select>
            <p className="text-[10px] text-slate-500 mt-1">
              Controls how detailed and technical the AI responses and exam question generator will be.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-xs transition"
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
