export interface Quiz {
  title: string;
  description: string;
  standard: string;
  subject: string;
  questions: Question[];
  startDate: Date;
  endDate: Date;
  price: number;
  duration: number;
  ageGroup: string;
  isActive: boolean;
  _id: string;
  createdAt: string;
}

export interface Question {
  id?: string;
  question: string;
  options: Option[];
}

export interface Option {
  id?: string;
  option: string;
  isCorrect: boolean;
}

export interface QuizResponse {
  docs: Quiz[];
  currentPage: number;
  totalPages: number;
}
