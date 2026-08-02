import fs from 'fs';
import path from 'path';
import {
  User,
  Course,
  Document,
  DocumentChunk,
  Conversation,
  Quiz,
  ExamAttempt,
  Flashcard,
  StudySession,
  AnalyticsData
} from '../types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DBData {
  users: User[];
  courses: Course[];
  documents: Document[];
  chunks: DocumentChunk[];
  conversations: Conversation[];
  quizzes: Quiz[];
  examAttempts: ExamAttempt[];
  flashcards: Flashcard[];
  studySessions: StudySession[];
}

const DB_FILE = path.join(DATA_DIR, 'db.json');

function loadDB(): DBData {
  if (!fs.existsSync(DB_FILE)) {
    const initial: DBData = getInitialData();
    saveDB(initial);
    return initial;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return {
      users: parsed.users || [],
      courses: parsed.courses || [],
      documents: parsed.documents || [],
      chunks: parsed.chunks || [],
      conversations: parsed.conversations || [],
      quizzes: parsed.quizzes || [],
      examAttempts: parsed.examAttempts || [],
      flashcards: parsed.flashcards || [],
      studySessions: parsed.studySessions || [],
    };
  } catch (e) {
    const initial = getInitialData();
    saveDB(initial);
    return initial;
  }
}

function saveDB(data: DBData) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getInitialData(): DBData {
  const defaultUser: User = {
    id: 'user_john_1',
    name: 'John Student',
    email: 'johncharlessarwi@gmail.com',
    university: 'State Tech University',
    program: 'B.Sc. Computer Science',
    year: 'Year 3',
    academicYear: '2025/2026',
    preferredLevel: 'University Level',
    role: 'student',
    createdAt: new Date().toISOString(),
  };

  const defaultAdmin: User = {
    id: 'user_admin_1',
    name: 'System Administrator',
    email: 'admin@jcsaa.edu',
    university: 'State Tech University',
    program: 'Computer Science Dept',
    year: 'Faculty',
    academicYear: '2025/2026',
    preferredLevel: 'Advanced',
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  const defaultCourses: Course[] = [
    {
      id: 'course_csc111',
      userId: defaultUser.id,
      code: 'CSC 111',
      name: 'Introduction to Computer Science',
      description: 'Fundamentals of computer science, algorithms, binary systems, and software hardware principles.',
      lecturer: 'Dr. Alan Turing',
      academicYear: '2025/2026',
      semester: 'First Semester',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'course_csc211',
      userId: defaultUser.id,
      code: 'CSC 211',
      name: 'Data Structures and Algorithms',
      description: 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting algorithms, and Time Complexity Analysis.',
      lecturer: 'Prof. Donald Knuth',
      academicYear: '2025/2026',
      semester: 'First Semester',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'course_csc311',
      userId: defaultUser.id,
      code: 'CSC 311',
      name: 'Computer Organization and Architecture',
      description: 'CPU architecture, ALU, Cache Memory, Virtual Memory, Pipelining, Instruction Set Architectures (ISA).',
      lecturer: 'Dr. John von Neumann',
      academicYear: '2025/2026',
      semester: 'Second Semester',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'course_csc321',
      userId: defaultUser.id,
      code: 'CSC 321',
      name: 'Computer Networks',
      description: 'OSI Model, TCP/IP, Routing Protocols, IP Addressing, Wireless Networks, and Network Security.',
      lecturer: 'Prof. Vint Cerf',
      academicYear: '2025/2026',
      semester: 'Second Semester',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'course_csc411',
      userId: defaultUser.id,
      code: 'CSC 411',
      name: 'Operating Systems',
      description: 'Process Management, CPU Scheduling, Memory Management, Deadlocks, File Systems, and Virtualization.',
      lecturer: 'Dr. Linus Torvalds',
      academicYear: '2025/2026',
      semester: 'First Semester',
      createdAt: new Date().toISOString(),
    },
  ];

  const defaultDocs: Document[] = [
    {
      id: 'doc_cpu_arch',
      userId: defaultUser.id,
      courseId: 'course_csc311',
      courseCode: 'CSC 311',
      fileName: 'CSC 311 - Lecture 1 to 4 CPU Architecture and Cache.pdf',
      fileType: 'pdf',
      fileSize: 2450000,
      pageCount: 24,
      chunkCount: 8,
      status: 'ready',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      id: 'doc_dsa_trees',
      userId: defaultUser.id,
      courseId: 'course_csc211',
      courseCode: 'CSC 211',
      fileName: 'CSC 211 - Trees, Binary Search Trees and AVL Trees.docx',
      fileType: 'docx',
      fileSize: 1200000,
      pageCount: 15,
      chunkCount: 6,
      status: 'ready',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'doc_os_memory',
      userId: defaultUser.id,
      courseId: 'course_csc411',
      courseCode: 'CSC 411',
      fileName: 'CSC 411 - Virtual Memory and Page Replacement Algorithms.pdf',
      fileType: 'pdf',
      fileSize: 3100000,
      pageCount: 30,
      chunkCount: 10,
      status: 'ready',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    }
  ];

  const defaultChunks: DocumentChunk[] = [
    {
      id: 'chunk_cpu_1',
      documentId: 'doc_cpu_arch',
      userId: defaultUser.id,
      courseId: 'course_csc311',
      fileName: 'CSC 311 - Lecture 1 to 4 CPU Architecture and Cache.pdf',
      pageNumber: 4,
      sectionTitle: 'Fetch-Decode-Execute Cycle',
      chunkIndex: 0,
      content: 'The Central Processing Unit (CPU) executes instructions via the Fetch-Decode-Execute cycle. 1) Fetch: The Program Counter (PC) holds the address of the next instruction in memory. The instruction is fetched from RAM into the Instruction Register (IR). 2) Decode: The Control Unit (CU) interprets the instruction bits to determine the operation and operands required. 3) Execute: The Arithmetic Logic Unit (ALU) carries out mathematical (addition, subtraction) or logical (AND, OR) operations, or data is moved between CPU registers and memory. 4) Store: Results are written back to registers or memory, and the PC is incremented.'
    },
    {
      id: 'chunk_cpu_2',
      documentId: 'doc_cpu_arch',
      userId: defaultUser.id,
      courseId: 'course_csc311',
      fileName: 'CSC 311 - Lecture 1 to 4 CPU Architecture and Cache.pdf',
      pageNumber: 12,
      sectionTitle: 'Cache Memory Hierarchy (L1, L2, L3)',
      chunkIndex: 1,
      content: 'CPU Cache is a small, ultra-fast static RAM (SRAM) located on or near the processor die to bridge the speed gap between the high-speed CPU core and main memory (DRAM). L1 Cache is fastest and smallest (32KB-128KB per core), divided into L1 Data and L1 Instruction caches. L2 Cache is slightly larger (512KB-2MB per core) with slightly higher latency. L3 Cache is a shared cache across all CPU cores (4MB-64MB+). Cache Hit occurs when requested data is found in cache; Cache Miss forces a slow memory access to DRAM.'
    },
    {
      id: 'chunk_cpu_3',
      documentId: 'doc_cpu_arch',
      userId: defaultUser.id,
      courseId: 'course_csc311',
      fileName: 'CSC 311 - Lecture 1 to 4 CPU Architecture and Cache.pdf',
      pageNumber: 18,
      sectionTitle: 'Cache Mapping Techniques & Associativity',
      chunkIndex: 2,
      content: 'Cache mapping determines how main memory blocks are assigned to cache lines: 1) Direct Mapping: Each main memory block maps to exactly one specific cache line using modulo arithmetic (Block Address % Number of Cache Lines). Simple and fast, but prone to conflict misses. 2) Fully Associative Mapping: Any memory block can be placed in any available cache line. Eliminates conflict misses, but requires expensive hardware comparators. 3) N-Way Set Associative Mapping: Compromise where cache is divided into sets, and a block maps to any line within a specific set.'
    },
    {
      id: 'chunk_dsa_1',
      documentId: 'doc_dsa_trees',
      userId: defaultUser.id,
      courseId: 'course_csc211',
      fileName: 'CSC 211 - Trees, Binary Search Trees and AVL Trees.docx',
      pageNumber: 3,
      sectionTitle: 'Binary Search Tree (BST) Properties',
      chunkIndex: 0,
      content: 'A Binary Search Tree (BST) is a hierarchical node-based data structure where each node has at most two children (left and right). Key property: For any node X, all values in its left subtree are strictly less than X.val, and all values in its right subtree are strictly greater than X.val. Average time complexity for Search, Insertion, and Deletion in a BST is O(log N). Worst-case time complexity is O(N) if the tree becomes skewed (unbalanced line).'
    },
    {
      id: 'chunk_dsa_2',
      documentId: 'doc_dsa_trees',
      userId: defaultUser.id,
      courseId: 'course_csc211',
      fileName: 'CSC 211 - Trees, Binary Search Trees and AVL Trees.docx',
      pageNumber: 8,
      sectionTitle: 'Self-Balancing AVL Trees and Rotations',
      chunkIndex: 1,
      content: 'An AVL tree is a self-balancing binary search tree named after Adelson-Velsky and Landis. In an AVL tree, the Balance Factor of every node X is defined as Height(LeftSubtree) - Height(RightSubtree). The balance factor must always be in {-1, 0, +1}. If an insertion or deletion causes a balance factor of +2 or -2, tree rotations are performed: Single Left Rotation (LL), Single Right Rotation (RR), Left-Right Rotation (LR), or Right-Left Rotation (RL). AVL trees guarantee strict O(log N) operations in all cases.'
    },
    {
      id: 'chunk_os_1',
      documentId: 'doc_os_memory',
      userId: defaultUser.id,
      courseId: 'course_csc411',
      fileName: 'CSC 411 - Virtual Memory and Page Replacement Algorithms.pdf',
      pageNumber: 5,
      sectionTitle: 'Virtual Memory & Paging',
      chunkIndex: 0,
      content: 'Virtual Memory is a memory management technique that creates an illusion of a large main memory by mapping virtual addresses used by processes to physical memory (RAM) and secondary disk storage (Swap/Paging file). Virtual memory space is divided into fixed-size chunks called Pages (typically 4KB). Physical memory is divided into corresponding Frames. The Memory Management Unit (MMU) uses a Page Table to translate virtual page numbers (VPN) to physical frame numbers (PFN). A Page Fault occurs when a referenced page is not currently loaded in physical RAM.'
    },
    {
      id: 'chunk_os_2',
      documentId: 'doc_os_memory',
      userId: defaultUser.id,
      courseId: 'course_csc411',
      fileName: 'CSC 411 - Virtual Memory and Page Replacement Algorithms.pdf',
      pageNumber: 14,
      sectionTitle: 'Page Replacement Algorithms (FIFO, LRU, Optimal)',
      chunkIndex: 1,
      content: 'When a page fault occurs and physical memory is full, a page replacement algorithm chooses which page frame to evict to disk: 1) FIFO (First-In, First-Out): Replaces the oldest page. Prone to Belady’s Anomaly (increasing frames can increase page faults). 2) LRU (Least Recently Used): Replaces the page that has not been referenced for the longest duration. Excellent performance using timestamp or stack implementation. 3) Optimal Algorithm (OPT/MIN): Replaces the page that will not be used for the longest period in the future. Theoretical benchmark, impossible to implement in real time.'
    }
  ];

  const defaultQuizzes: Quiz[] = [
    {
      id: 'quiz_csc311_1',
      userId: defaultUser.id,
      courseId: 'course_csc311',
      documentId: 'doc_cpu_arch',
      title: 'CSC 311 Midterm Prep: CPU Architecture & Cache Memory',
      topic: 'CPU Architecture & Memory Hierarchy',
      difficulty: 'University Exam Level',
      durationMinutes: 15,
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      questions: [
        {
          id: 'q1',
          question: 'In the Fetch-Decode-Execute cycle, which register holds the address of the next instruction to be fetched from RAM?',
          type: 'mcq',
          options: [
            'Instruction Register (IR)',
            'Memory Data Register (MDR)',
            'Program Counter (PC)',
            'Accumulator (ACC)'
          ],
          correctAnswer: 'Program Counter (PC)',
          explanation: 'The Program Counter (PC) holds the memory address of the next instruction to execute. Once fetched into the Instruction Register, the PC increments.',
          difficulty: 'Medium',
          sourceDocName: 'CSC 311 - Lecture 1 to 4 CPU Architecture and Cache.pdf',
          sourcePage: 4
        },
        {
          id: 'q2',
          question: 'Level 1 (L1) Cache memory is typically constructed using Dynamic RAM (DRAM).',
          type: 'true_false',
          options: ['True', 'False'],
          correctAnswer: 'False',
          explanation: 'L1 Cache is constructed using ultra-fast Static RAM (SRAM). DRAM is used for main system memory.',
          difficulty: 'Easy',
          sourceDocName: 'CSC 311 - Lecture 1 to 4 CPU Architecture and Cache.pdf',
          sourcePage: 12
        },
        {
          id: 'q3',
          question: 'Briefly explain the difference between a Cache Hit and a Cache Miss.',
          type: 'short_answer',
          correctAnswer: 'A Cache Hit occurs when requested data is found in CPU cache memory. A Cache Miss occurs when data is missing from cache, forcing a slower read from main RAM.',
          explanation: 'Cache hits allow high-speed execution without memory delay penalties, while cache misses incur DRAM latency.',
          difficulty: 'Medium',
          sourceDocName: 'CSC 311 - Lecture 1 to 4 CPU Architecture and Cache.pdf',
          sourcePage: 12
        }
      ]
    }
  ];

  const defaultExamAttempts: ExamAttempt[] = [
    {
      id: 'attempt_1',
      userId: defaultUser.id,
      quizId: 'quiz_csc311_1',
      quizTitle: 'CSC 311 Midterm Prep: CPU Architecture & Cache Memory',
      score: 16,
      maxScore: 20,
      percentage: 80,
      timeSpentSeconds: 420,
      answers: [
        {
          questionId: 'q1',
          answerText: 'Program Counter (PC)',
          isCorrect: true,
          scoreEarned: 5,
          maxScore: 5,
          explanation: 'Correct! The Program Counter specifies the address of the next instruction.'
        },
        {
          questionId: 'q2',
          answerText: 'False',
          isCorrect: true,
          scoreEarned: 5,
          maxScore: 5,
          explanation: 'Correct! SRAM is used for L1/L2 cache.'
        },
        {
          questionId: 'q3',
          answerText: 'Cache hit is when memory is in L1, cache miss is when memory is not found and needs RAM.',
          isCorrect: true,
          scoreEarned: 6,
          maxScore: 10,
          explanation: 'Good explanation of the core concept. To earn full marks, mention that cache hits avoid processor stall cycles.'
        }
      ],
      weakTopics: ['Cache Mapping Techniques', 'Direct Mapping Conflicts'],
      strongTopics: ['Fetch-Decode-Execute Cycle', 'Cache Memory Levels'],
      recommendation: 'Review CSC 311 Lecture 4, pages 18-22 on Direct Mapping and Set Associative Mapping.',
      completedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    }
  ];

  const defaultFlashcards: Flashcard[] = [
    {
      id: 'fc_1',
      userId: defaultUser.id,
      courseId: 'course_csc311',
      documentId: 'doc_cpu_arch',
      front: 'What is the role of the ALU in the CPU?',
      back: 'The Arithmetic Logic Unit (ALU) performs all arithmetic calculations (addition, subtraction) and bitwise logical operations (AND, OR, NOT, XOR) for the processor.',
      topic: 'CPU Architecture',
      difficulty: 'Easy',
      status: 'known',
      createdAt: new Date().toISOString()
    },
    {
      id: 'fc_2',
      userId: defaultUser.id,
      courseId: 'course_csc211',
      documentId: 'doc_dsa_trees',
      front: 'What is the Balance Factor of a node in an AVL Tree?',
      back: 'Balance Factor = Height(Left Subtree) - Height(Right Subtree). In an AVL tree, it must always be -1, 0, or +1 for every node.',
      topic: 'AVL Trees',
      difficulty: 'Hard',
      status: 'difficult',
      createdAt: new Date().toISOString()
    },
    {
      id: 'fc_3',
      userId: defaultUser.id,
      courseId: 'course_csc411',
      documentId: 'doc_os_memory',
      front: 'What is Belady’s Anomaly in operating system paging?',
      back: 'Belady’s Anomaly is a phenomenon in FIFO page replacement where increasing the number of physical memory page frames causes the total number of page faults to INCREASE rather than decrease.',
      topic: 'Virtual Memory',
      difficulty: 'Hard',
      status: 'difficult',
      createdAt: new Date().toISOString()
    }
  ];

  return {
    users: [defaultUser, defaultAdmin],
    courses: defaultCourses,
    documents: defaultDocs,
    chunks: defaultChunks,
    conversations: [],
    quizzes: defaultQuizzes,
    examAttempts: defaultExamAttempts,
    flashcards: defaultFlashcards,
    studySessions: [],
  };
}

export const db = {
  getUsers: (): User[] => loadDB().users,
  getUserById: (id: string): User | undefined => loadDB().users.find(u => u.id === id),
  getUserByEmail: (email: string): User | undefined => loadDB().users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  saveUser: (user: User): User => {
    const data = loadDB();
    const existingIndex = data.users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      data.users[existingIndex] = user;
    } else {
      data.users.push(user);
    }
    saveDB(data);
    return user;
  },

  getCourses: (userId: string): Course[] => {
    const data = loadDB();
    const userCourses = data.courses.filter(c => c.userId === userId || userId === 'user_admin_1');
    return userCourses.map(c => {
      const docCount = data.documents.filter(d => d.courseId === c.id).length;
      return { ...c, documentCount: docCount };
    });
  },
  getCourseById: (id: string): Course | undefined => loadDB().courses.find(c => c.id === id),
  saveCourse: (course: Course): Course => {
    const data = loadDB();
    const idx = data.courses.findIndex(c => c.id === course.id);
    if (idx >= 0) {
      data.courses[idx] = course;
    } else {
      data.courses.push(course);
    }
    saveDB(data);
    return course;
  },
  deleteCourse: (id: string) => {
    const data = loadDB();
    data.courses = data.courses.filter(c => c.id !== id);
    data.documents = data.documents.filter(d => d.courseId !== id);
    data.chunks = data.chunks.filter(ch => ch.courseId !== id);
    saveDB(data);
  },

  getDocuments: (userId: string, courseId?: string): Document[] => {
    const data = loadDB();
    let docs = data.documents.filter(d => d.userId === userId || userId === 'user_admin_1');
    if (courseId) {
      docs = docs.filter(d => d.courseId === courseId);
    }
    return docs;
  },
  getDocumentById: (id: string): Document | undefined => loadDB().documents.find(d => d.id === id),
  saveDocument: (doc: Document): Document => {
    const data = loadDB();
    const idx = data.documents.findIndex(d => d.id === doc.id);
    if (idx >= 0) {
      data.documents[idx] = doc;
    } else {
      data.documents.push(doc);
    }
    saveDB(data);
    return doc;
  },
  deleteDocument: (id: string) => {
    const data = loadDB();
    data.documents = data.documents.filter(d => d.id !== id);
    data.chunks = data.chunks.filter(ch => ch.documentId !== id);
    saveDB(data);
  },

  getChunks: (userId: string, courseId?: string, documentId?: string): DocumentChunk[] => {
    const data = loadDB();
    let chunks = data.chunks.filter(c => c.userId === userId || userId === 'user_admin_1');
    if (documentId) {
      chunks = chunks.filter(c => c.documentId === documentId);
    } else if (courseId) {
      chunks = chunks.filter(c => c.courseId === courseId);
    }
    return chunks;
  },
  saveChunks: (newChunks: DocumentChunk[]) => {
    const data = loadDB();
    data.chunks.push(...newChunks);
    saveDB(data);
  },

  getConversations: (userId: string): Conversation[] => {
    const data = loadDB();
    return data.conversations.filter(c => c.userId === userId);
  },
  getConversationById: (id: string): Conversation | undefined => loadDB().conversations.find(c => c.id === id),
  saveConversation: (conv: Conversation): Conversation => {
    const data = loadDB();
    const idx = data.conversations.findIndex(c => c.id === conv.id);
    if (idx >= 0) {
      data.conversations[idx] = conv;
    } else {
      data.conversations.push(conv);
    }
    saveDB(data);
    return conv;
  },
  deleteConversation: (id: string) => {
    const data = loadDB();
    data.conversations = data.conversations.filter(c => c.id !== id);
    saveDB(data);
  },

  getQuizzes: (userId: string): Quiz[] => loadDB().quizzes.filter(q => q.userId === userId),
  getQuizById: (id: string): Quiz | undefined => loadDB().quizzes.find(q => q.id === id),
  saveQuiz: (quiz: Quiz): Quiz => {
    const data = loadDB();
    const idx = data.quizzes.findIndex(q => q.id === quiz.id);
    if (idx >= 0) data.quizzes[idx] = quiz;
    else data.quizzes.push(quiz);
    saveDB(data);
    return quiz;
  },

  getExamAttempts: (userId: string): ExamAttempt[] => loadDB().examAttempts.filter(e => e.userId === userId),
  saveExamAttempt: (attempt: ExamAttempt): ExamAttempt => {
    const data = loadDB();
    data.examAttempts.push(attempt);
    saveDB(data);
    return attempt;
  },

  getFlashcards: (userId: string, courseId?: string, documentId?: string): Flashcard[] => {
    const data = loadDB();
    let cards = data.flashcards.filter(f => f.userId === userId);
    if (documentId) cards = cards.filter(f => f.documentId === documentId);
    else if (courseId) cards = cards.filter(f => f.courseId === courseId);
    return cards;
  },
  saveFlashcards: (cards: Flashcard[]) => {
    const data = loadDB();
    data.flashcards.push(...cards);
    saveDB(data);
  },
  updateFlashcardStatus: (id: string, status: 'unseen' | 'known' | 'difficult') => {
    const data = loadDB();
    const card = data.flashcards.find(f => f.id === id);
    if (card) {
      card.status = status;
      saveDB(data);
    }
  },

  getAnalytics: (userId: string): AnalyticsData => {
    const data = loadDB();
    const docs = data.documents.filter(d => d.userId === userId);
    const courses = data.courses.filter(c => c.userId === userId);
    const attempts = data.examAttempts.filter(e => e.userId === userId);
    
    let totalQuestionsPracticed = 0;
    attempts.forEach(a => totalQuestionsPracticed += a.answers.length);
    
    const totalScoreSum = attempts.reduce((acc, curr) => acc + curr.percentage, 0);
    const avgScore = attempts.length > 0 ? Math.round(totalScoreSum / attempts.length) : 85;

    const weakTopicsSet = new Set<string>();
    const strongTopicsSet = new Set<string>();

    attempts.forEach(a => {
      a.weakTopics.forEach(t => weakTopicsSet.add(t));
      a.strongTopics.forEach(t => strongTopicsSet.add(t));
    });

    if (weakTopicsSet.size === 0) {
      weakTopicsSet.add('Virtual Memory & Page Replacement');
      weakTopicsSet.add('Cache Direct Mapping Conflicts');
      weakTopicsSet.add('Tree Balance Rotations');
    }
    if (strongTopicsSet.size === 0) {
      strongTopicsSet.add('Fetch-Decode-Execute Cycle');
      strongTopicsSet.add('CPU Registers');
      strongTopicsSet.add('Binary Search Trees');
    }

    const courseAccuracy = courses.map(c => {
      return {
        courseCode: c.code,
        courseName: c.name,
        accuracy: c.code === 'CSC 311' ? 82 : c.code === 'CSC 211' ? 88 : c.code === 'CSC 411' ? 74 : 90
      };
    });

    const recentActivity = attempts.slice(-5).map(a => ({
      id: a.id,
      type: 'Exam Attempt',
      title: `${a.quizTitle} (${a.percentage}%)`,
      date: new Date(a.createdAt).toLocaleDateString()
    }));

    const recommendations = [
      {
        topic: 'Virtual Memory & Page Replacement',
        courseCode: 'CSC 411',
        accuracy: 62,
        reason: 'Recent page replacement algorithms quiz accuracy was below 70%. Reviewing FIFO vs LRU is recommended.'
      },
      {
        topic: 'Cache Set Associative Mapping',
        courseCode: 'CSC 311',
        accuracy: 68,
        reason: 'Missed 2 short-answer questions on cache block line mapping calculations in CSC 311.'
      }
    ];

    return {
      totalNotes: docs.length,
      totalCourses: courses.length,
      questionsPracticed: totalQuestionsPracticed || 18,
      quizzesCompleted: attempts.length || 3,
      averageScore: avgScore,
      studyTimeHours: 14.5,
      weakTopics: Array.from(weakTopicsSet),
      strongTopics: Array.from(strongTopicsSet),
      courseAccuracy,
      recentActivity,
      recommendations
    };
  }
};
