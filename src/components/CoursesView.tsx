import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  FileText,
  User,
  Calendar,
  Sparkles,
  Upload,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Course, Document } from '../types.js';

interface CoursesViewProps {
  courses: Course[];
  documents: Document[];
  onCreateCourse: (data: Partial<Course>) => Promise<void>;
  onDeleteCourse: (id: string) => Promise<void>;
  onSelectCourseForChat: (courseId: string) => void;
  setActiveTab: (tab: string) => void;
}

export function CoursesView({
  courses,
  documents,
  onCreateCourse,
  onDeleteCourse,
  onSelectCourseForChat,
  setActiveTab,
}: CoursesViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [semester, setSemester] = useState('First Semester');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      alert('Course Code and Course Name are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onCreateCourse({
        code,
        name,
        description,
        lecturer,
        semester,
        academicYear,
      });
      setCode('');
      setName('');
      setDescription('');
      setLecturer('');
      setShowModal(false);
    } catch (e: any) {
      alert('Error creating course: ' + (e?.message || 'Error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <BookOpen className="text-blue-600" />
            <span>Computer Science Course Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize your academic study notes, lecture slides, and AI quizzes by course module.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition"
        >
          <Plus size={16} />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => {
          const courseDocs = documents.filter((d) => d.courseId === course.id);
          return (
            <div
              key={course.id}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-5 flex flex-col justify-between space-y-4 transition shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="bg-blue-50 border border-blue-100 text-blue-700 font-sans font-extrabold text-xs px-2.5 py-1 rounded-md">
                    {course.code}
                  </div>
                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    className="p-1.5 rounded-md bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Course"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{course.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description || 'No description added.'}</p>
                </div>

                <div className="pt-2 space-y-1.5 text-[11px] text-slate-500 border-t border-slate-100 font-medium">
                  {course.lecturer && (
                    <div className="flex items-center space-x-2">
                      <User size={12} className="text-slate-400" />
                      <span>Lecturer: {course.lecturer}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar size={12} className="text-slate-400" />
                    <span>
                      {course.semester} • {course.academicYear}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText size={12} className="text-blue-600" />
                    <span className="font-semibold text-slate-700">
                      {courseDocs.length} Uploaded Documents
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectCourseForChat(course.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 rounded-lg transition text-center flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Sparkles size={14} />
                  <span>Ask Course AI</span>
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition"
                  title="Upload Materials"
                >
                  <Upload size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 text-slate-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-lg flex items-center space-x-2 text-slate-900">
                <BookOpen size={20} className="text-blue-600" />
                <span>Add Academic Course</span>
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Course Code (e.g. CSC 111) *</label>
                <input
                  type="text"
                  required
                  placeholder="CSC 111"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Introduction to Computer Science"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lecturer Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Dr. Alan Turing"
                  value={lecturer}
                  onChange={(e) => setLecturer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none"
                  >
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                    <option value="Summer Term">Summer Term</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description / Syllabus Overview</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what this course covers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition"
                >
                  {isSubmitting ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
