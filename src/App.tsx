import React, { useEffect, useState } from 'react';
import { Navigation, NavTab } from './components/Navigation.js';
import { DashboardView } from './components/DashboardView.js';
import { MyNotesView } from './components/MyNotesView.js';
import { CoursesView } from './components/CoursesView.js';
import { AIChatView } from './components/AIChatView.js';
import { QuestionGeneratorView } from './components/QuestionGeneratorView.js';
import { ExamModeView } from './components/ExamModeView.js';
import { FlashcardsView } from './components/FlashcardsView.js';
import { StudyModeView } from './components/StudyModeView.js';
import { SummariesView } from './components/SummariesView.js';
import { AnalyticsView } from './components/AnalyticsView.js';
import { ProfileView } from './components/ProfileView.js';
import { AdminView } from './components/AdminView.js';
import { api } from './lib/api.js';
import {
  User,
  Course,
  Document,
  Conversation,
  Quiz,
  ExamAttempt,
  Flashcard,
  AnalyticsData
} from './types.js';
import { Search, X, BookOpen, FileText, HelpCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Preselected filters for cross-navigation
  const [preselectedCourseId, setPreselectedCourseId] = useState<string | undefined>(undefined);
  const [preselectedDocId, setPreselectedDocId] = useState<string | undefined>(undefined);
  const [activeExamQuiz, setActiveExamQuiz] = useState<Quiz | null>(null);

  // Global search modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ documents: Document[]; courses: Course[]; questions: any[] } | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
      const [u, c, d, conv, q, att, fc, ana] = await Promise.all([
        api.getProfile(),
        api.getCourses(),
        api.getDocuments(),
        api.getConversations(),
        api.getQuizzes(),
        api.getExamAttempts(),
        api.getFlashcards(),
        api.getAnalytics(),
      ]);

      if (u.user) setUser(u.user);
      if (c.courses) setCourses(c.courses);
      if (d.documents) setDocuments(d.documents);
      if (conv.conversations) {
        setConversations(conv.conversations);
        if (conv.conversations.length > 0) setActiveConvId(conv.conversations[0].id);
      }
      if (q.quizzes) setQuizzes(q.quizzes);
      if (att.attempts) setExamAttempts(att.attempts);
      if (fc.flashcards) setFlashcards(fc.flashcards);
      if (ana.analytics) setAnalytics(ana.analytics);
    } catch (e) {
      console.error('Error fetching app data', e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handler: Global Search
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await api.globalSearch(searchQuery);
      setSearchResults(res.results);
      setShowSearchModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Create Course
  const handleCreateCourse = async (data: Partial<Course>) => {
    const res = await api.createCourse(data);
    if (res.course) {
      setCourses((prev) => [...prev, res.course]);
    }
  };

  // Handler: Delete Course
  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course and its notes?')) return;
    await api.deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setDocuments((prev) => prev.filter((d) => d.courseId !== id));
  };

  // Handler: Upload Document
  const handleUploadDocument = async (file: File, courseId: string) => {
    const res = await api.uploadDocument(file, courseId);
    if (res.document) {
      setDocuments((prev) => [res.document, ...prev]);
      // Refresh analytics
      api.getAnalytics().then((a) => a.analytics && setAnalytics(a.analytics));
    }
  };

  // Handler: Delete Document
  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Delete this document from vector memory?')) return;
    await api.deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Handler: New Conversation
  const handleNewConversation = async (scope: 'all' | 'course' | 'document', courseId?: string, docId?: string) => {
    const res = await api.createConversation({ scope, courseId, documentId: docId });
    if (res.conversation) {
      setConversations((prev) => [res.conversation, ...prev]);
      setActiveConvId(res.conversation.id);
    }
  };

  // Handler: Send Message
  const handleSendMessage = async (convId: string, prompt: string, courseId?: string, docId?: string) => {
    const res = await api.sendMessage({ conversationId: convId, prompt, courseId, documentId: docId });
    if (res.conversation) {
      setConversations((prev) => prev.map((c) => (c.id === convId ? res.conversation : c)));
    }
  };

  // Handler: Delete Conversation
  const handleDeleteConversation = async (id: string) => {
    await api.deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConvId(remaining[0]?.id || null);
    }
  };

  // Handler: Generate Quiz
  const handleGenerateQuiz = async (data: any) => {
    const res = await api.generateQuiz(data);
    if (res.quiz) {
      setQuizzes((prev) => [res.quiz, ...prev]);
    }
    return res;
  };

  // Handler: Submit Exam
  const handleSubmitExam = async (quizId: string, answers: Record<string, string>, timeSpentSeconds: number) => {
    const res = await api.submitExam({ quizId, answers, timeSpentSeconds });
    if (res.attempt) {
      setExamAttempts((prev) => [res.attempt, ...prev]);
      api.getAnalytics().then((a) => a.analytics && setAnalytics(a.analytics));
    }
    return res.attempt;
  };

  // Handler: Cross Navigation to Chat
  const handleSelectCourseForChat = (courseId: string, docId?: string) => {
    setPreselectedCourseId(courseId);
    setPreselectedDocId(docId);
    setActiveTab('chat');
  };

  // Handler: Launch Exam Mode from Quiz Generator
  const handleStartExam = (quiz: Quiz) => {
    setActiveExamQuiz(quiz);
    setActiveTab('exam');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Top Header & Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={user?.name || 'John CS Student'}
        userRole={user?.role || 'student'}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main View Area */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {activeTab === 'dashboard' && (
            <DashboardView
              analytics={analytics}
              documents={documents}
              courses={courses}
              setActiveTab={setActiveTab}
              userName={user?.name}
            />
          )}

          {activeTab === 'notes' && (
            <MyNotesView
              documents={documents}
              courses={courses}
              onUpload={handleUploadDocument}
              onDelete={handleDeleteDocument}
              onSelectCourseForChat={handleSelectCourseForChat}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesView
              courses={courses}
              documents={documents}
              onCreateCourse={handleCreateCourse}
              onDeleteCourse={handleDeleteCourse}
              onSelectCourseForChat={handleSelectCourseForChat}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'chat' && (
            <AIChatView
              conversations={conversations}
              courses={courses}
              documents={documents}
              activeConvId={activeConvId}
              setActiveConvId={setActiveConvId}
              onNewConversation={handleNewConversation}
              onSendMessage={handleSendMessage}
              onDeleteConversation={handleDeleteConversation}
              preselectedCourseId={preselectedCourseId}
              preselectedDocId={preselectedDocId}
            />
          )}

          {activeTab === 'generator' && (
            <QuestionGeneratorView
              courses={courses}
              documents={documents}
              onGenerateQuiz={handleGenerateQuiz}
              onStartExam={handleStartExam}
            />
          )}

          {activeTab === 'exam' && (
            <ExamModeView
              quiz={activeExamQuiz || quizzes[0]}
              onSubmitExam={handleSubmitExam}
              onExitExam={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsView
              flashcards={flashcards}
              courses={courses}
              documents={documents}
              onGenerateFlashcards={async (data) => {
                const res = await api.generateFlashcards(data);
                if (res.flashcards) setFlashcards(res.flashcards);
              }}
              onUpdateStatus={async (id, status) => {
                await api.updateFlashcardStatus(id, status);
                setFlashcards((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
              }}
            />
          )}

          {activeTab === 'study_mode' && (
            <StudyModeView
              courses={courses}
              userLevel={user?.explanationLevel}
              onSendMessage={async (convId, prompt, courseId) => {
                await handleSendMessage(convId, prompt, courseId);
              }}
            />
          )}

          {activeTab === 'summaries' && (
            <SummariesView
              courses={courses}
              documents={documents}
              onSummarize={api.summarize}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              analytics={analytics}
              attempts={examAttempts}
              courses={courses}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              user={user}
              onUpdateProfile={async (data) => {
                const res = await api.updateProfile(data);
                if (res.user) setUser(res.user);
              }}
            />
          )}

          {activeTab === 'admin' && <AdminView />}
        </main>
      </div>

      {/* Global Search Results Modal */}
      {showSearchModal && searchResults && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-4 text-slate-800 shadow-xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Search size={18} className="text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Search Results for "{searchQuery}"</h3>
              </div>
              <button onClick={() => setShowSearchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1 custom-scroll">
              {/* Documents */}
              <div className="space-y-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                  Matched Academic Documents ({searchResults.documents.length}):
                </span>
                {searchResults.documents.length === 0 ? (
                  <p className="text-slate-400 italic">No matching document titles.</p>
                ) : (
                  searchResults.documents.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        handleSelectCourseForChat(d.courseId, d.id);
                        setShowSearchModal(false);
                      }}
                      className="p-3 bg-slate-50 border border-slate-200 hover:border-blue-500/50 hover:bg-blue-50/50 rounded-xl cursor-pointer transition flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText size={16} className="text-blue-600" />
                        <span className="font-semibold text-slate-900">{d.fileName}</span>
                      </div>
                      <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded">{d.courseCode}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Courses */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                  Matched Courses ({searchResults.courses.length}):
                </span>
                {searchResults.courses.length === 0 ? (
                  <p className="text-slate-400 italic">No matching courses.</p>
                ) : (
                  searchResults.courses.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        handleSelectCourseForChat(c.id);
                        setShowSearchModal(false);
                      }}
                      className="p-3 bg-slate-50 border border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-50/50 rounded-xl cursor-pointer transition flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <BookOpen size={16} className="text-indigo-600" />
                        <span className="font-semibold text-slate-900">
                          {c.code} — {c.name}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowSearchModal(false)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Close Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
