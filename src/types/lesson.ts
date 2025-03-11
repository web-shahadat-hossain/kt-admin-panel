export type MaterialType = "pdf" | "video" | "none";


export interface Lesson {
  _id?: string;
  courseId: string;
  title: string;
  description: string;
  materialType: MaterialType;
  materialUrl: string;
  isMaterial: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface LessonState {
  lessons: Lesson[]; 
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number,
}

export const initialState: LessonState = {
  lessons: [], 
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};