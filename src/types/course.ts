import { Standard } from "./standard";
import { Subject } from "./subject";

export interface Course {
  _id?: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  duration: string;
  features: string[];
  thumbnail: string;
  standard: Standard;
  subject: Subject;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  lessons: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  boardId?: string;
  bookPDF?: string;
}

interface CourseState {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

export const initialState: CourseState = {
  courses: [],
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};
