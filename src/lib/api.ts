import {
  User,
  Course,
  Document,
  Conversation,
  Quiz,
  ExamAttempt,
  Flashcard,
  AnalyticsData,
  ChatMessage
} from '../types.js';

let currentUserId = 'user_john_1';

export function setCurrentUserId(userId: string) {
  currentUserId = userId;
}

export function getCurrentUserId() {
  return currentUserId;
}

const headers = () => ({
  'Content-Type': 'application/json',
  'x-user-id': currentUserId,
});

export const api = {
  // Auth
  login: async (email: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },
  register: async (userData: Partial<User>) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  },
  getProfile: async () => {
    const res = await fetch('/api/auth/me', { headers: headers() });
    return res.json();
  },
  updateProfile: async (userData: Partial<User>) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  // Courses
  getCourses: async (): Promise<{ courses: Course[] }> => {
    const res = await fetch('/api/courses', { headers: headers() });
    return res.json();
  },
  createCourse: async (courseData: Partial<Course>): Promise<{ course: Course }> => {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(courseData),
    });
    return res.json();
  },
  deleteCourse: async (id: string) => {
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE', headers: headers() });
    return res.json();
  },

  // Documents
  getDocuments: async (courseId?: string): Promise<{ documents: Document[] }> => {
    const url = courseId ? `/api/documents?courseId=${courseId}` : '/api/documents';
    const res = await fetch(url, { headers: headers() });
    return res.json();
  },
  uploadDocument: async (file: File, courseId: string): Promise<{ document: Document; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', courseId);

    const res = await fetch('/api/documents/upload', {
      method: 'POST',
      headers: { 'x-user-id': currentUserId },
      body: formData,
    });
    return res.json();
  },
  deleteDocument: async (id: string) => {
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE', headers: headers() });
    return res.json();
  },

  // Conversations & RAG Chat
  getConversations: async (): Promise<{ conversations: Conversation[] }> => {
    const res = await fetch('/api/conversations', { headers: headers() });
    return res.json();
  },
  createConversation: async (data: { title?: string; courseId?: string; documentId?: string; scope?: string }): Promise<{ conversation: Conversation }> => {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  sendMessage: async (data: { conversationId: string; prompt: string; courseId?: string; documentId?: string }): Promise<{ conversation: Conversation; message: ChatMessage }> => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteConversation: async (id: string) => {
    const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE', headers: headers() });
    return res.json();
  },

  // Quizzes & Exam
  getQuizzes: async (): Promise<{ quizzes: Quiz[] }> => {
    const res = await fetch('/api/quizzes', { headers: headers() });
    return res.json();
  },
  getQuizById: async (id: string): Promise<{ quiz: Quiz }> => {
    const res = await fetch(`/api/quizzes/${id}`, { headers: headers() });
    return res.json();
  },
  generateQuiz: async (data: {
    courseId?: string;
    documentId?: string;
    topic?: string;
    difficulty?: string;
    numQuestions?: number;
    questionType?: string;
  }): Promise<{ quiz: Quiz; error?: string }> => {
    const res = await fetch('/api/quiz/generate', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  submitExam: async (data: { quizId: string; answers: Record<string, string>; timeSpentSeconds: number }): Promise<{ attempt: ExamAttempt }> => {
    const res = await fetch('/api/exam/submit', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getExamAttempts: async (): Promise<{ attempts: ExamAttempt[] }> => {
    const res = await fetch('/api/exam/attempts', { headers: headers() });
    return res.json();
  },

  // Flashcards
  getFlashcards: async (courseId?: string, documentId?: string): Promise<{ flashcards: Flashcard[] }> => {
    let url = '/api/flashcards';
    const params = new URLSearchParams();
    if (courseId) params.append('courseId', courseId);
    if (documentId) params.append('documentId', documentId);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, { headers: headers() });
    return res.json();
  },
  generateFlashcards: async (data: { courseId?: string; documentId?: string; topic?: string }): Promise<{ flashcards: Flashcard[]; error?: string }> => {
    const res = await fetch('/api/flashcards/generate', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateFlashcardStatus: async (id: string, status: 'known' | 'difficult' | 'unseen') => {
    const res = await fetch(`/api/flashcards/${id}/status`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Summaries & Analytics
  summarize: async (data: { courseId?: string; documentId?: string; summaryType?: string }): Promise<{ summary: string; error?: string }> => {
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getAnalytics: async (): Promise<{ analytics: AnalyticsData }> => {
    const res = await fetch('/api/analytics', { headers: headers() });
    return res.json();
  },
  globalSearch: async (q: string) => {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { headers: headers() });
    return res.json();
  },
  getAdminStats: async () => {
    const res = await fetch('/api/admin/stats', { headers: headers() });
    return res.json();
  }
};
