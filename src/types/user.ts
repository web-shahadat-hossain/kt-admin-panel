export interface User {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    profileImg: string;
    isBlocked: boolean;
    isDeleted: boolean;
    lang: string;
    dob: Date;
    balance: number;
    referralCode: string;
    isVerified: boolean;
    lastLoginAt: Date | null;
    userRole: string;
    createdAt: Date;
    updatedAt: Date;
    subject: [
        {
            _id: string;
            subject: string;
        }
    ],
    activity: [
        {
            _id: string;
            activityname: string;
        }
    ],
    stdId: {
        _id: string;
        std: string;
    },
    boardId: {
        _id: string;
        boardname: string;
        boardshortname: string;
    },
    learningGoal: string;
    schoolName: string;
    totalCourses: number;
    completedQuizzes: number;
}

export interface UserResponse {
    docs: User[];
    currentPage: number;
    totalPages: number;
}

export interface UserUpdate {
    mobile: string;
    dob: Date | null;
    balance: number;
}

interface UsersState {
    users: User[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
}

export interface UserDetailResponse {
    data: User;
}

export const initialState: UsersState = {
    users: [],
    isLoading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
};
