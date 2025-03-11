import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RootState } from "@/store/store";
import { Users, DollarSign, BookOpen, IndianRupee } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { useSelector } from "react-redux";

const DashboardCards = () => {
  const { totalUser, activeQuiz, payment } = useSelector(
    (store: RootState) => store.auth
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{payment / 100}</div>
          <p className="text-xs text-muted-foreground">
            Revenue from quiz and course purchases
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUser}</div>
          <p className="text-xs text-muted-foreground">Registered users</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Quizzes</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeQuiz}</div>
          <p className="text-xs text-muted-foreground">Published quizzes</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
