import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  BookOpen,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
  FileCheck,
  BarChart3,
  UserCheck,
  ShieldAlert,
  GraduationCap,
  Menu,
  X,
  Search
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'chat'
  | 'notes'
  | 'courses'
  | 'generator'
  | 'exam'
  | 'flashcards'
  | 'study_mode'
  | 'summaries'
  | 'analytics'
  | 'admin'
  | 'profile';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userName?: string;
  userRole?: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export function Navigation({
  activeTab,
  setActiveTab,
  userName = 'John Student',
  userRole = 'student',
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}: NavigationProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Tutor (RAG)', icon: MessageSquare, badge: 'RAG AI' },
    { id: 'notes', label: 'My Notes', icon: FileText },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'generator', label: 'Question Generator', icon: HelpCircle },
    { id: 'exam', label: 'Exam Mode', icon: Clock, badge: 'Timed' },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'study_mode', label: 'Study Mode', icon: Sparkles },
    { id: 'summaries', label: 'Summarizer', icon: FileCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile & Level', icon: GraduationCap },
  ];

  if (userRole === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: ShieldAlert });
  }

  const handleSelect = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 px-4 lg:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => handleSelect('dashboard')}>
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-sm">
              J
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  JCSAA
                </span>
                <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                  Academic AI Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Retrieval-Augmented Study & Exam Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={onSearchSubmit} className="hidden md:flex items-center relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search notes, courses, questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/50 transition"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        </form>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSelect('profile')}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium transition"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-[10px]">
              {userName.charAt(0)}
            </div>
            <span className="hidden sm:inline font-semibold text-slate-800">{userName}</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div
        className={`fixed lg:sticky top-[57px] left-0 z-50 lg:z-30 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 h-[calc(100vh-57px)] flex flex-col justify-between transition-transform duration-200 custom-scroll ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-1 overflow-y-auto custom-scroll">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
            Academic Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id as NavTab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Brand info inside sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-[11px] text-slate-400">
          <div className="flex items-center space-x-2 font-semibold text-slate-300">
            <GraduationCap size={14} className="text-blue-400" />
            <span>JCSAA v2.5 • Academic AI</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400 leading-relaxed">
            Computer Science RAG Engine & Quiz Simulator
          </p>
        </div>
      </div>
    </>
  );
}
