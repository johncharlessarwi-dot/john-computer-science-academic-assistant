export type ExplanationLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'University Level';

export interface User {
  id: string;
  name: string;
  email: string;
  university?: string;
  program?: string;
  year?: string;
  academicYear?: string;
  preferredLevel?: ExplanationLevel;
  explanationLevel?: ExplanationLevel;
  role: 'student' | 'admin';
  createdAt: string;
}

export interface Course {
  id: string;
  userId: string;
  code: string; // e.g. CSC 111
  name: string; // e.g. Introduction to Computer Science
  description?: string;
  lecturer?: string;
  academicYear?: string;
  semester?: string;
  createdAt: string;
  documentCount?: number;
}

export interface Document {
  id: string;
  userId: string;
  courseId: string;
  courseCode?: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'txt' | 'md' | 'image';
  fileSize: number;
  pageCount: number;
  chunkCount: number;
  status: 'uploading' | 'processing' | 'extracting' | 'embedding' | 'ready' | 'failed';
  errorMessage?: string;
  createdAt: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  userId: string;
  courseId: string;
  content: string;
  pageNumber: number;
  sectionTitle?: string;
  chunkIndex: number;
  fileName: string;
  embedding?: number[];
}

export interface Citation {
  documentId: string;
  documentName: string;
  pageNumber: number;
  sectionTitle?: string;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  isSourceBased?: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  courseId?: string;
  documentId?: string;
  scope: 'all' | 'course' | 'document';
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export type QuestionType = 'mcq' | 'true_false' | 'short_answer' | 'fill_blank' | 'matching' | 'essay' | 'coding';

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[]; // for MCQ and matching
  matchingPairs?: { left: string; right: string }[]; // for matching questions
  correctAnswer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'University Exam Level';
  sourceDocName?: string;
  sourcePage?: number;
}

export interface Quiz {
  id: string;
  userId: string;
  courseId?: string;
  documentId?: string;
  title: string;
  topic?: string;
  difficulty: string;
  durationMinutes: number;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface StudentAnswer {
  questionId: string;
  answerText: string;
  isCorrect?: boolean;
  scoreEarned?: number;
  maxScore?: number;
  explanation?: string;
  feedback?: string;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpentSeconds: number;
  answers: StudentAnswer[];
  weakTopics: string[];
  strongTopics: string[];
  recommendation: string;
  completedAt: string;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  userId: string;
  courseId?: string;
  documentId?: string;
  front: string;
  back: string;
  topic?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'unseen' | 'known' | 'difficult';
  createdAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  courseId?: string;
  topic?: string;
  durationMinutes: number;
  activityType: 'chat' | 'quiz' | 'flashcards' | 'study_mode' | 'summarize';
  createdAt: string;
}

export interface AnalyticsData {
  totalNotes: number;
  totalCourses: number;
  questionsPracticed: number;
  quizzesCompleted: number;
  averageScore: number;
  studyTimeHours: number;
  weakTopics: string[];
  strongTopics: string[];
  courseAccuracy: { courseCode: string; courseName: string; accuracy: number }[];
  recentActivity: { id: string; type: string; title: string; date: string }[];
  recommendations: {
    topic: string;
    courseCode: string;
    accuracy: number;
    reason: string;
  }[];
}
