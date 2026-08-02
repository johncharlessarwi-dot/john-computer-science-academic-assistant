import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  FileCode,
  FileSpreadsheet,
  FileImage,
  RefreshCw,
  Download,
  FileDown,
  X,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { Document, Course } from '../types.js';
import { api } from '../lib/api.js';
import { downloadNotesAsPDF, downloadNotesAsMarkdown } from '../utils/exportNotes.js';

interface MyNotesViewProps {
  documents: Document[];
  courses: Course[];
  onUpload: (file: File, courseId: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSelectCourseForChat?: (courseId: string, docId?: string) => void;
}

export function MyNotesView({
  documents,
  courses,
  onUpload,
  onDelete,
  onSelectCourseForChat,
}: MyNotesViewProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [uploadCourseId, setUploadCourseId] = useState<string>(courses[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Export Modal State
  const [exportDoc, setExportDoc] = useState<Document | null>(null);
  const [exportSummaryType, setExportSummaryType] = useState<string>('exam_revision');
  const [summaryText, setSummaryText] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchDocumentSummary = async (doc: Document, type: string) => {
    setIsGeneratingSummary(true);
    try {
      const res = await api.summarize({
        documentId: doc.id,
        courseId: doc.courseId,
        summaryType: type,
      });
      if (res.summary) {
        setSummaryText(res.summary);
      } else if (res.error) {
        setSummaryText(`Error generating summary: ${res.error}`);
      }
    } catch (err: any) {
      setSummaryText(`Failed to generate notes: ${err?.message || 'Error'}`);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleOpenExportModal = (doc: Document) => {
    setExportDoc(doc);
    setExportSummaryType('exam_revision');
    setSummaryText('');
    setCopied(false);
    fetchDocumentSummary(doc, 'exam_revision');
  };

  const handleSummaryTypeChange = (type: string) => {
    setExportSummaryType(type);
    if (exportDoc) {
      fetchDocumentSummary(exportDoc, type);
    }
  };

  const handleCopyText = () => {
    if (!summaryText) return;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!exportDoc || !summaryText) return;
    downloadNotesAsPDF(exportDoc.fileName, exportDoc.courseCode || 'CS', summaryText);
  };

  const handleDownloadMarkdown = () => {
    if (!exportDoc || !summaryText) return;
    downloadNotesAsMarkdown(exportDoc.fileName, exportDoc.courseCode || 'CS', summaryText);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await handleFileProcess(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await handleFileProcess(file);
    }
  };

  const handleFileProcess = async (file: File) => {
    const courseId = uploadCourseId || courses[0]?.id;
    if (!courseId) {
      alert('Please select or create a course first before uploading lecture notes.');
      return;
    }
    setIsUploading(true);
    try {
      await onUpload(file, courseId);
    } catch (e: any) {
      alert('Upload failed: ' + (e?.message || 'Error'));
    } finally {
      setIsUploading(false);
    }
  };

  // Filter & Sort
  const filteredDocs = documents
    .filter((doc) => {
      const matchesCourse = selectedCourseId === 'all' || doc.courseId === selectedCourseId;
      const matchesSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCourse && matchesSearch;
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-rose-600" size={20} />;
      case 'docx':
        return <FileText className="text-blue-600" size={20} />;
      case 'pptx':
        return <FileSpreadsheet className="text-amber-600" size={20} />;
      case 'image':
        return <FileImage className="text-purple-600" size={20} />;
      case 'txt':
      case 'md':
        return <FileCode className="text-emerald-600" size={20} />;
      default:
        return <FileText className="text-slate-500" size={20} />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="text-blue-600" />
            <span>My Lecture Notes Library</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload, chunk, embed, and manage your Computer Science learning materials for RAG AI querying.
          </p>
        </div>
      </div>

      {/* Drag and Drop Upload Area */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
            <BookOpen size={16} className="text-blue-600" />
            <span>Target Course for New Upload:</span>
          </label>
          <select
            value={uploadCourseId}
            onChange={(e) => setUploadCourseId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {courses.length === 0 && <option value="">No courses yet (Create one first)</option>}
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition ${
            dragActive
              ? 'border-blue-600 bg-blue-50/50'
              : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.md,.png,.jpg,.jpeg,.webp"
            className="hidden"
          />

          <div className="space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Drag & Drop academic files here, or{' '}
                <label htmlFor="file-upload" className="text-blue-600 hover:text-blue-700 underline cursor-pointer">
                  browse files
                </label>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supported formats: <strong className="text-slate-700">PDF, DOCX, PPTX, TXT, MD, Images (OCR)</strong>
              </p>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 font-medium flex items-center justify-center space-x-4">
              <span>Automatic Text Extraction</span>
              <span>•</span>
              <span>Chunking & Embeddings</span>
              <span>•</span>
              <span>Vector Search Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 shadow-sm p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Filter size={14} />
            <span className="font-medium">Course:</span>
          </div>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="all">All Courses ({documents.length})</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} ({documents.filter((d) => d.courseId === c.id).length})
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search document names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40"
          />
          <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 text-center text-slate-500 text-xs space-y-2">
            <FileText size={32} className="mx-auto text-slate-400" />
            <p>No documents found matching your filter.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-slate-200 shadow-sm hover:border-blue-300 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
            >
              <div className="flex items-start space-x-3 overflow-hidden">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 shrink-0">
                  {getFileIcon(doc.fileType)}
                </div>
                <div className="space-y-1 truncate">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="font-bold text-slate-900 text-sm truncate">{doc.fileName}</span>
                    <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {doc.courseCode}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span>Size: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>Pages: {doc.pageCount}</span>
                    <span>•</span>
                    <span>Vector Chunks: {doc.chunkCount}</span>
                    <span>•</span>
                    <span>Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
                <span
                  className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                    doc.status === 'ready'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : doc.status === 'failed'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {doc.status === 'ready' && <CheckCircle2 size={12} />}
                  {doc.status === 'failed' && <AlertCircle size={12} />}
                  {['uploading', 'extracting', 'embedding'].includes(doc.status) && (
                    <Loader2 size={12} className="animate-spin" />
                  )}
                  <span>{doc.status}</span>
                </span>

                {doc.status === 'ready' && (
                  <button
                    onClick={() => handleOpenExportModal(doc)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition flex items-center space-x-1.5"
                    title="Export summarized notes as PDF or Markdown"
                  >
                    <Download size={14} />
                    <span>Export Notes</span>
                  </button>
                )}

                {onSelectCourseForChat && (
                  <button
                    onClick={() => onSelectCourseForChat(doc.courseId, doc.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition"
                  >
                    Chat with Note
                  </button>
                )}

                <button
                  onClick={() => onDelete(doc.id)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition"
                  title="Delete Document"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Export Summarized Notes Modal */}
      {exportDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
                  <FileDown size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white flex items-center space-x-2">
                    <span>Export Document Notes</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold px-2 py-0.5 rounded-full">
                      {exportDoc.courseCode || 'CS'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 truncate max-w-md">
                    {exportDoc.fileName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setExportDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50">
              {/* Summary Focus Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles size={14} className="text-blue-600" />
                  <span>Select Summary Type & Depth:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'exam_revision', label: 'Exam Revision Notes', desc: 'High-yield topics & exam tips' },
                    { id: 'study_guide', label: 'In-Depth Study Guide', desc: 'Detailed concepts & breakdown' },
                    { id: 'glossary', label: 'Key Terms & Glossary', desc: 'Core definitions & formulas' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSummaryTypeChange(option.id)}
                      className={`p-3 rounded-xl border text-left transition text-xs font-medium ${
                        exportSummaryType === option.id
                          ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/30'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold">{option.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Preview Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="uppercase tracking-wider">Note Preview</span>
                  <span className="text-slate-400 font-normal">Formatted for offline reading</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 min-h-[220px] max-h-[300px] overflow-y-auto font-mono text-xs text-slate-800 shadow-inner leading-relaxed whitespace-pre-wrap">
                  {isGeneratingSummary ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3 text-slate-500">
                      <Loader2 size={28} className="animate-spin text-blue-600" />
                      <p className="font-sans text-xs font-medium">Extracting vectors & generating AI summary...</p>
                    </div>
                  ) : summaryText ? (
                    summaryText
                  ) : (
                    <p className="text-slate-400 font-sans italic">Select a summary type to generate your exportable notes.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyText}
                disabled={!summaryText || isGeneratingSummary}
                className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 transition"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Raw Text'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  disabled={!summaryText || isGeneratingSummary}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 disabled:opacity-50 shadow-xs transition"
                >
                  <FileCode size={15} className="text-slate-600" />
                  <span>Download .MD</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={!summaryText || isGeneratingSummary}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs disabled:opacity-50 transition"
                >
                  <Download size={15} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
