export interface QuizResult {
  _id: string;
  userId: {
    _id: string;
    name: string;
    mobile: string;
  };
  score: number;
  totalQuestions: number;
  startedAt: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  timeTaken: number;
  quizId: {
    _id: string;
    title: string;
  };
}

export interface QuizResultResponse {
  docs: QuizResult[];
  currentPage: number;
  totalPages: number;
}
