import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserProfileProps } from "@/pages/UserDetails.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store.ts";
import { fetchUserQuizResult } from "@/store/slices/userdetails-slice.ts";
import { useEffect } from "react";
import { MyPagination } from "@/components/ui/my-pagination.tsx";

export const QuizResults = ({ userId }: UserProfileProps) => {

    const { quizResult, qrCurrentPage, qrTotalPages } = useSelector((state: RootState) => state.userDetail);

    const dispatch = useDispatch<AppDispatch>();

    const fetchQuizResult = (page: number) => {
        dispatch(fetchUserQuizResult({ page, userId }))
    };

    useEffect(() => {
        fetchQuizResult(1);
    }, []);

    return (
        <Card className="pb-5">
            <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Quiz Name</TableHead>
                            <TableHead>Score</TableHead>
                            {/*<TableHead>Questions</TableHead>*/}
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quizResult.length == 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-10">
                                    No quiz result found
                                </TableCell>
                            </TableRow>
                        ) : (
                            quizResult.map((quiz) => (
                                <TableRow key={quiz._id}>
                                    <TableCell>{quiz.quizId.title}</TableCell>
                                    <TableCell>
                                        {/* {`font-medium ${quiz.score >= 80 ? 'text-green-600' : 'text-yellow-600'}`}*/}
                                        <span className="font-medium">
                                            {quiz.score} / {quiz.totalQuestions}
                                        </span>
                                    </TableCell>
                                    {/*<TableCell>{quiz.correctAnswers}/{quiz.totalQuestions}</TableCell>*/}
                                    <TableCell>{quiz.submittedAt ? (new Date(quiz.submittedAt).toLocaleTimeString()) : ("-")}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            {qrTotalPages >= 1 && (
                <MyPagination
                    currentPage={qrCurrentPage}
                    totalPages={qrTotalPages}
                    onPageChange={fetchQuizResult}
                />
            )}
        </Card>
    );
};