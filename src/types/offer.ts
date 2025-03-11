export interface Offer {
  _id: string;
  title: string;
  description: string;
  image: string;
  offrPer: number;
  startAt: Date;
  endAt: Date;
  courses: string[];
  quizzes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  _id: string;
  title: string;
}

export interface Quiz {
  _id: string;
  title: string;
}

export interface OfferResponse {
  offers: Offer[];
  currentPage: number;
  totalPages: number;
}
export interface OfferState {
  offers: Offer[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  courses: Course[];
  isLoadingCourse: boolean;
  quizzes: Quiz[];
  isLoadingQuiz: boolean;
}
