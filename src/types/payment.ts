export interface Payment {
  _id?: string;
  quizId: {
    _id?: string;
    title: string;
  };
  courseId: {
    _id?: string;
    title: string;
  };
  userId: {
    _id?: string;
    mobile: string;
    name: string;
  };
  paymentStatus: string;
  receiptId: string;
  paymentDate: Date;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentResponse {
  docs: Payment[];
  totalPages: number;
  currentPage: number;
}

interface PaymentState {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

export const initialState: PaymentState = {
  payments: [],
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};
