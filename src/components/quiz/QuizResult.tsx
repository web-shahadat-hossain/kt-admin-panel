import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { getQuizResult } from "@/store/slices/quiz-slice";
import { MyPagination } from "../ui/my-pagination";

export interface QuizResultProps {
  quizId: string;
}

export const QuizResultTable = ({ quizId }: QuizResultProps) => {
  const { quizResult, isQuizResultLoading, qrCurrentPage, qrTotalPages } =
    useSelector((state: RootState) => state.quiz);

  const dispath = useDispatch<AppDispatch>();

  const fetchQuizResult = (page: number) => {
    dispath(getQuizResult({ quizId: quizId, page: page }));
  };

  useEffect(() => {
    fetchQuizResult(1);
  }, []);

  return (
    <div className="bg-white rounded-md border">
      {isQuizResultLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant Name</TableHead>
              <TableHead>Participant Mobile</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Time Taken</TableHead>
              <TableHead>Started At</TableHead>
              <TableHead>Submitted At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizResult.length == 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No Quiz Results Available.
                </TableCell>
              </TableRow>
            ) : (
              quizResult.map((result) => (
                <TableRow key={result._id}>
                  <TableCell>{result.userId.name}</TableCell>
                  <TableCell>{result.userId.mobile}</TableCell>
                  <TableCell>{result.score}</TableCell>
                  <TableCell>
                    {Math.floor(result.timeTaken / 3600000) > 0 &&
                      `${Math.floor(result.timeTaken / 3600000)} hours `}
                    {Math.floor((result.timeTaken % 3600000) / 60000)} minutes{" "}
                    {((result.timeTaken % 60000) / 1000).toFixed(0)} seconds
                  </TableCell>
                  <TableCell>
                    {result.startedAt
                      ? `${new Date(result.startedAt).toLocaleString()}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {result.submittedAt
                      ? `${new Date(result.submittedAt).toLocaleString()}`
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {qrTotalPages >= 1 && (
        <MyPagination
          currentPage={qrCurrentPage}
          totalPages={qrTotalPages}
          onPageChange={fetchQuizResult}
        />
      )}
    </div>
  );
};
