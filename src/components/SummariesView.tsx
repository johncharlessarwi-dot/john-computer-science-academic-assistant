import React, { useState } from 'react';
import {
  FileCheck,
  Sparkles,
  BookOpen,
  FileText,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import { Course, Document } from '../types.js';

interface SummariesViewProps {
  courses: Course[];
  documents: Document[];
  onSummarize: (data: { courseId?: string; documentId?: string; summaryType?: string }) => Promise<{ summary: string; error?: string }>;
}

export function SummariesView({
  courses,
  documents,
  onSummarize,
}: SummariesViewProps) {
  const [courseId, setCourseId] = useState<string>(courses[0]?.id || '');
  const [documentId, setDocumentId] = useState<string>('');
  const [summaryType, setSummaryType] = useState('exam_revision');
  const [summaryOutput, setSummaryOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setSummaryOutput('');

    try {
      const res = await onSummarize({
        courseId: courseId || undefined,
        documentId: documentId || undefined,
        summaryType,
      });

      if (res.error) {
        alert(res.error);
      } else {
        setSummaryOutput(res.summary);
      }
    } catch (err: any) {
      alert('Summarization error: ' + (err?.message || 'Error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <FileCheck className="text-emerald-600" />
          <span>Academic Notes Summarizer & Revision Sheet</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Automatically condense extensive computer science lecture decks into high-yield exam revision summaries, glossaries, and cheat sheets.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
        <form onSubmit={handleSummarize} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-end font-medium">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Course Module</label>
            <select
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setDocumentId('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Uploaded Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Specific Document (Optional)</label>
            <select
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 truncate"
            >
              <option value="">Entire Course Notes Collection</option>
              {documents
                .filter((d) => !courseId || d.courseId === courseId)
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fileName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Summary Format</label>
            <select
              value={summaryType}
              onChange={(e) => setSummaryType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="exam_revision">High-Yield Exam Revision Notes</option>
              <option value="glossary">Key Definitions & Glossary</option>
              <option value="cheat_sheet">Formula & Algorithm Cheat Sheet</option>
              <option value="bullet_points">Executive Bullet Point Summary</option>
            </select>
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-lg shadow-xs transition"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Synthesizing Academic Revision Sheet...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Revision Sheet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Output Result Area */}
      {summaryOutput && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2 font-bold text-sm text-emerald-700">
              <FileCheck size={18} />
              <span>Generated Revision Summary</span>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg transition shadow-xs"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
            </button>
          </div>

          <div className="prose max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-800">
            {summaryOutput}
          </div>
        </div>
      )}
    </div>
  );
}
