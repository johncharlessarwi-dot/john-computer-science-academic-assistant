import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  BookOpen,
  FileText,
  Bookmark,
  Check,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Loader2,
  Info
} from 'lucide-react';
import { Conversation, Course, Document, Citation, ChatMessage } from '../types.js';

interface AIChatViewProps {
  conversations: Conversation[];
  courses: Course[];
  documents: Document[];
  activeConvId: string | null;
  setActiveConvId: (id: string | null) => void;
  onNewConversation: (scope: 'all' | 'course' | 'document', courseId?: string, docId?: string) => Promise<void>;
  onSendMessage: (conversationId: string, prompt: string, courseId?: string, docId?: string) => Promise<void>;
  onDeleteConversation: (id: string) => Promise<void>;
  preselectedCourseId?: string;
  preselectedDocId?: string;
}

export function AIChatView({
  conversations,
  courses,
  documents,
  activeConvId,
  setActiveConvId,
  onNewConversation,
  onSendMessage,
  onDeleteConversation,
  preselectedCourseId,
  preselectedDocId,
}: AIChatViewProps) {
  const [scope, setScope] = useState<'all' | 'course' | 'document'>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(preselectedCourseId || courses[0]?.id || '');
  const [selectedDocId, setSelectedDocId] = useState<string>(preselectedDocId || documents[0]?.id || '');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preselectedDocId) {
      setScope('document');
      setSelectedDocId(preselectedDocId);
    } else if (preselectedCourseId) {
      setScope('course');
      setSelectedCourseId(preselectedCourseId);
    }
  }, [preselectedCourseId, preselectedDocId]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isSending]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isSending) return;

    const promptText = inputPrompt;
    setInputPrompt('');
    setIsSending(true);

    try {
      let convId = activeConv?.id;
      if (!convId) {
        await onNewConversation(scope, scope === 'course' ? selectedCourseId : undefined, scope === 'document' ? selectedDocId : undefined);
        convId = conversations[0]?.id;
      }

      await onSendMessage(
        convId!,
        promptText,
        scope === 'course' ? selectedCourseId : undefined,
        scope === 'document' ? selectedDocId : undefined
      );
    } catch (err: any) {
      alert('Chat error: ' + (err?.message || 'Error'));
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const quickPrompts = [
    'What is virtual memory according to my notes?',
    'Explain the CPU cache hierarchy (L1, L2, L3) with page numbers.',
    'Explain the fetch-decode-execute cycle step by step.',
    'What are the differences between RAM and ROM?',
    'Give me 5 key exam concepts from this material.',
  ];

  return (
    <div className="flex h-[calc(100vh-57px)] bg-slate-50 text-slate-800 overflow-hidden">
      {/* Left Sidebar: Conversations & Scope */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-3 space-y-4 shrink-0 shadow-xs">
        <button
          onClick={() => onNewConversation(scope, scope === 'course' ? selectedCourseId : undefined, scope === 'document' ? selectedDocId : undefined)}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-xs transition"
        >
          <Plus size={16} />
          <span>New Chat Session</span>
        </button>

        {/* Scope Selector */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
          <label className="font-bold text-slate-600 uppercase tracking-wider text-[10px] block">
            RAG Document Scope:
          </label>
          <div className="space-y-1.5 font-medium">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="radio"
                name="scope"
                checked={scope === 'all'}
                onChange={() => setScope('all')}
                className="text-blue-600 focus:ring-0"
              />
              <span>All Uploaded Notes</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="radio"
                name="scope"
                checked={scope === 'course'}
                onChange={() => setScope('course')}
                className="text-blue-600 focus:ring-0"
              />
              <span>One Course Module</span>
            </label>

            {scope === 'course' && (
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs text-slate-800 rounded p-1.5 mt-1"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}
                  </option>
                ))}
              </select>
            )}

            <label className="flex items-center space-x-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="radio"
                name="scope"
                checked={scope === 'document'}
                onChange={() => setScope('document')}
                className="text-blue-600 focus:ring-0"
              />
              <span>Specific Document</span>
            </label>

            {scope === 'document' && (
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs text-slate-800 rounded p-1.5 mt-1 truncate"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fileName}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-y-auto space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block">
            Chat History
          </span>
          {conversations.map((conv) => {
            const isActive = conv.id === (activeConv?.id);
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`group flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition ${
                  isActive ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <MessageSquare size={14} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  <span className="truncate">{conv.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-rose-600 transition"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between h-full bg-slate-50 overflow-hidden relative">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl w-full mx-auto">
          {!activeConv || activeConv.messages.length === 0 ? (
            <div className="text-center py-12 space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <Sparkles size={28} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Ask your Academic CS Notes</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Query lecture slides, course outlines, and uploaded textbooks. Results show citations with page numbers.
                </p>
              </div>

              {/* Quick Prompt Chips */}
              <div className="space-y-2 pt-2 text-left">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Suggested Prompts:
                </span>
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputPrompt(p);
                    }}
                    className="w-full text-left bg-white hover:bg-slate-100 border border-slate-200 p-2.5 rounded-lg text-xs text-slate-700 hover:text-slate-900 transition shadow-xs"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            activeConv.messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`flex space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs">
                      J
                    </div>
                  )}

                  <div className={`space-y-2 max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none font-medium shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {/* Markdown whitespace rendering */}
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                      {/* Source badge indicator */}
                      {!isUser && msg.isSourceBased !== undefined && (
                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span
                            className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                              msg.isSourceBased
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {msg.isSourceBased ? '✓ SOURCE-BASED ANSWER' : '⚠ GENERAL KNOWLEDGE ANSWER'}
                          </span>

                          <div className="flex items-center space-x-2 text-slate-400">
                            <button
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="hover:text-slate-700 transition flex items-center space-x-1"
                            >
                              {copiedMsgId === msg.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                              <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Citations List */}
                      {!isUser && msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Academic References & Citations:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {msg.citations.map((cite, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={() => setSelectedCitation(cite)}
                                className="inline-flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[11px] px-2.5 py-1 rounded-md font-sans font-medium transition"
                              >
                                <Bookmark size={11} className="text-blue-600" />
                                <span>
                                  {cite.documentName} — Page {cite.pageNumber}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isSending && (
            <div className="flex items-center space-x-3 text-slate-500 text-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                J
              </div>
              <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-xs">
                <Loader2 size={14} className="animate-spin text-blue-600" />
                <span>Searching academic notes & synthesizing answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shadow-xs">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              placeholder="Ask anything about your uploaded notes (e.g. What is virtual memory?)..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isSending}
              className="absolute right-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition shadow-xs"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">
            Answers prioritized from uploaded lecture notes. Always verify citations before academic exams.
          </p>
        </div>
      </div>

      {/* Citation Inspector Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 text-slate-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Bookmark size={18} className="text-blue-600" />
                <h3 className="font-bold text-sm">Source Citation Inspector</h3>
              </div>
              <button onClick={() => setSelectedCitation(null)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Document Name:</span>
                <p className="font-bold text-blue-700">{selectedCitation.documentName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Page Number:</span>
                  <p className="font-semibold text-slate-800">Page {selectedCitation.pageNumber}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Section:</span>
                  <p className="font-semibold text-slate-800">{selectedCitation.sectionTitle || 'General Notes'}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Extracted Text Chunk:</span>
                <p className="text-slate-700 leading-relaxed font-mono text-[11px] italic">"{selectedCitation.snippet}"</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCitation(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
