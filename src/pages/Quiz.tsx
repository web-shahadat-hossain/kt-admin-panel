import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddQuizDialog } from "@/components/quiz/AddQuizDialog";
import { QuizTable } from "@/components/quiz/QuizTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchQuizzes, setCurrentQuiz } from "@/store/slices/quiz-slice";

const Quiz = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const { currentQuiz } = useSelector((state: RootState) => state.quiz);

  useEffect(() => {
    dispatch(fetchQuizzes({ page: 1, search: "" }));
  }, []);

  const canelEdit = () => {
    dispatch(setCurrentQuiz(null));
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Quiz Management</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Quiz
        </Button>
      </div>

      <QuizTable />

      <AddQuizDialog
        open={isAddDialogOpen || !!currentQuiz}
        onOpenChange={(isOpen: boolean) => {
          canelEdit();
          setIsAddDialogOpen(isOpen);
        }}
        editQuiz={currentQuiz}
      />
    </div>
  );
};

export default Quiz;
