export interface Transaction {
  _id?: string;

  transactionType: string;
  points?: number;
  paymentId?: string;
  referredBy?: string;
  referredTo?: string;
  amount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionResponse {
  docs: Transaction[];
  totalPages: number;
  currentPage: number;
}

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

export const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};
