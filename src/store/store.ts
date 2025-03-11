import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice';
import standardSlice from './slices/standard-slice';
import activitySlice from './slices/activity-slice';
import subjectSlice from './slices/subject-slice';
import boardSlice from './slices/board-slice';
import courseSlice from './slices/course-slice';
import quizSlice from './slices/quiz-slice';
import lessonSlice from './slices/lesson-slice';
import userSlice from './slices/users-slice';
import paymentSlice from './slices/payment-slice';
import transactionSlice from './slices/transaction';
import mentoreSlice from './slices/mentore-slice';
import offerSlice from './slices/offer-slice';
import userDetailsSlice from '@/store/slices/userdetails-slice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    activity: activitySlice,
    standard: standardSlice,
    subject: subjectSlice,
    board: boardSlice,
    course: courseSlice,
    quiz: quizSlice,
    lesson: lessonSlice,
    user: userSlice,
    payment: paymentSlice,
    mentore: mentoreSlice,
    offer: offerSlice,
    userDetail: userDetailsSlice,
    transaction: transactionSlice,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false, // Required for redux-persist
  //   }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
