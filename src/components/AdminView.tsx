import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Users,
  FileText,
  Database,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { api } from '../lib/api.js';

export function AdminView() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getAdminStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-slate-900">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <ShieldAlert className="text-rose-600" />
          <span>JCSAA System Admin Panel</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor vector embeddings storage, RAG processing status, document indexing, and user activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Registered Users</span>
            <Users size={16} className="text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.totalUsers || 1}</p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Documents Index</span>
            <FileText size={16} className="text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.totalDocuments || 3}</p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Vector Chunks Stored</span>
            <Database size={16} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{stats?.totalChunks || 36}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
          <Cpu size={16} className="text-blue-600" />
          <span>AI & Vector Engine Infrastructure</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-700">Embedding Model:</span>
            <span className="font-mono font-bold text-blue-700">gemini-embedding-2-preview</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-700">LLM Generation Model:</span>
            <span className="font-mono font-bold text-purple-700">gemini-2.5-flash</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-700">Vector Metric:</span>
            <span className="font-mono font-bold text-emerald-700">Cosine Similarity (768d)</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-700">Document Pipeline:</span>
            <span className="font-mono font-bold text-emerald-700">PDF, DOCX, PPTX, OCR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
