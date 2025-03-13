import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  BookOpen,
  CreditCard,
  GraduationCap,
  Activity,
  BookOpen as Subject,
  School,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Presentation,
  BookOpenText,
  User2,
  BookMarked,
  Percent,
  IndianRupee,
  Video,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getProfile, logout } from '@/store/slices/auth-slice';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { email } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Users', path: '/dashboard/users' },
    {
      icon: BookMarked,
      label: 'Student Corner',
      submenu: [
        { icon: Activity, label: 'Activity', path: '/dashboard/activity' },
        { icon: School, label: 'Standard', path: '/dashboard/standard' },
        { icon: Subject, label: 'Subject', path: '/dashboard/subject' },
        { icon: LayoutGrid, label: 'Board', path: '/dashboard/board' },
      ],
    },
    {
      icon: GraduationCap,
      label: 'Course Manage',
      submenu: [
        { icon: User2, label: 'Mentor', path: '/dashboard/mentor' },
        { icon: BookOpenText, label: 'Course', path: '/dashboard/course' },
        { icon: Presentation, label: 'Lesson', path: '/dashboard/lesson' },
      ],
    },
    { icon: BookOpen, label: 'Quiz Management', path: '/dashboard/quiz' },
    { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
    {
      icon: IndianRupee,
      label: 'Transactions',
      path: '/dashboard/transaction',
    },
    { icon: Percent, label: 'Manage Offers', path: '/dashboard/offer' },
    { icon: Video, label: 'Upcoming Live', path: '/dashboard/upcomingLive' },
    { icon: Video, label: ' Live', path: '/dashboard/live' },
    // { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) =>
              item.submenu ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 ml-2">
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.path} asChild>
                        <Link
                          to={subItem.path}
                          className="flex items-center px-2 py-2"
                        >
                          <subItem.icon className="w-4 h-4 mr-2" />
                          {subItem.label}
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              )
            )}
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`lg:ml-64 min-h-screen transition-all duration-200 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {email}</span>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
