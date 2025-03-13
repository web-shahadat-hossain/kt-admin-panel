import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import Users from './pages/Users';
import Quiz from './pages/Quiz';
import Payments from './pages/Payments';
import DashboardCards from './components/dashboard/DashboardCards';
import LessonPage from './pages/LessonPage';
import { CoursePage } from './pages/CoursePage';
import Board from './pages/student/Board';
import StandardTable from './pages/student/Standard';
import Activity from './pages/student/Activity';
import Cookies from 'js-cookie';
import CheckoutPage from './pages/checkout/CheckoutPage';
import PaymentStatusPage from './pages/checkout/PaymentStatusPage';
import { MentorePage } from './pages/MentorePage';
import { OfferPage } from './pages/OffersPage';
import { SubjectPage } from './pages/student/Subject';
import { UserDetails } from '@/pages/UserDetails.tsx';
import Transaction from './pages/Transaction';
import LiveStream from './pages/LiveStream';
import UpcomingLive from './pages/UpcomingLive';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = Cookies.get('accessToken');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  const isAuthenticated = Cookies.get('accessToken');

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Route for the Checkout Page */}
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Route for Payment Status Pages */}
          <Route
            path="/payment-status/:status"
            element={<PaymentStatusPage />}
          />

          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <div className="page-transition">
                  <DashboardCards />
                </div>
              }
            />
            <Route path="users" element={<Users />} />
            <Route path="userDetails/:id" element={<UserDetails />} />

            <Route path="quiz" element={<Quiz />} />
            <Route path="payments" element={<Payments />} />
            <Route path="transaction" element={<Transaction />} />
            {/* <Route
              path="settings"
              element={<div className="page-transition">Settings Content</div>}
            /> */}
            <Route path="activity" element={<Activity />} />
            <Route path="standard" element={<StandardTable />} />
            <Route path="subject" element={<SubjectPage />} />
            <Route path="board" element={<Board />} />
            <Route path="lesson" element={<LessonPage />} />
            <Route path="course" element={<CoursePage />} />
            <Route path="mentor" element={<MentorePage />} />
            <Route path="offer" element={<OfferPage />} />
            <Route path="live" element={<LiveStream />} />
            {/* <Route path="live/:liveId" element={<LiveStream />} /> */}
            <Route path="upcomingLive" element={<UpcomingLive />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
};

export default App;
