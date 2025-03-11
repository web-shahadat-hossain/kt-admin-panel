export interface MentorData {
  _id?: string;
  name: string;
  email: string;
  mobile: string;
  image?: string;
  expertise: string[];
  experienceYears: number;
  bio?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MentorState {
  mentors: MentorData[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

export const initialState: MentorState = {
  mentors: [],
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};
