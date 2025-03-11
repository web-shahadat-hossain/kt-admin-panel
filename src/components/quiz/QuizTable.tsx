import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Check, X, BarChart2 } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Quiz } from '@/types/quiz';
import {
  fetchQuizById,
  fetchQuizzes,
  toggleQuiz,
} from '@/store/slices/quiz-slice';
import { MyPagination } from '../ui/my-pagination';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { QuizResultTable } from './QuizResult';

export const QuizTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { quizzes, isLoading, error, currentPage, totalPages } = useSelector(
    (state: RootState) => state.quiz
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quizResultId, setQuizResultId] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  // const filteredQuizzes = quizzes.filter((quiz) =>
  //   quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  useEffect(() => {
    handlePageChange(1);
  }, [searchTerm]);

  const handleToggle = (quizId: string) => {
    dispatch(toggleQuiz(quizId));
  };

  const handleEditQuiz = (quiz: Quiz) => {
    dispatch(fetchQuizById(quiz._id));
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchQuizzes({ page: page, search: searchTerm }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search quizzes by title"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Duration (mins)</TableHead>
              <TableHead>Price (₹)</TableHead>
              <TableHead>Refer Bonus</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(quizzes) &&
              quizzes.map((quiz, index) => (
                <TableRow key={quiz._id}>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>
                    {new Date(quiz.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(quiz.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{quiz.duration}</TableCell>
                  <TableCell>
                    {quiz.price ? `₹${quiz.price}` : 'Free'}
                  </TableCell>
                  <TableCell>{quiz?.bonusPercent}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        quiz.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {quiz.isActive ? 'Active' : 'InActive'}
                    </span>
                    {new Date() > new Date(quiz.endDate) ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-80 ms-2">
                        Complete
                      </span>
                    ) : new Date() >= new Date(quiz.startDate) &&
                      new Date() <= new Date(quiz.endDate) ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 ms-2">
                        Running
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 ms-2">
                        Upcoming
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditQuiz(quiz)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={
                          quiz.isActive ? 'text-red-500' : 'text-green-500'
                        }
                        onClick={() => handleToggle(quiz._id)}
                      >
                        {quiz.isActive ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {new Date() >= new Date(quiz.startDate) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsDialogOpen(true);
                          setQuizResultId(quiz._id);
                        }}
                      >
                        <BarChart2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {totalPages >= 1 && (
        <MyPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="lg:max-w-[1300px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quiz Results</DialogTitle>
            <DialogClose />
          </DialogHeader>

          <QuizResultTable quizId={quizResultId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
