import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserProfileProps } from '@/pages/UserDetails.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store.ts';
import {
  fetchUserPayment,
  fetchUserQuizResult,
} from '@/store/slices/userdetails-slice.ts';
import { useEffect } from 'react';
import { MyPagination } from '@/components/ui/my-pagination.tsx';

export const PaymentHistory = ({ userId }: UserProfileProps) => {
  // Mock payment data
  const { payments, pyCurrentPage, pyTotalPage } = useSelector(
    (state: RootState) => state.userDetail
  );

  const dispatch = useDispatch<AppDispatch>();

  const fetchPayments = (page: number) => {
    dispatch(fetchUserPayment({ page, userId: userId }));
  };

  useEffect(() => {
    fetchPayments(1);
  }, []);

  return (
    <Card className="pb-5">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length == 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No payment found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>
                    {payment.courseId
                      ? 'Course'
                      : payment.quizId
                      ? 'Quiz'
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {payment.quizId
                      ? payment.quizId.title
                      : payment?.courseId?.title}
                  </TableCell>
                  <TableCell>${payment.amount / 100}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        payment.paymentStatus.toLowerCase() === 'success'
                          ? 'bg-green-100 text-green-800'
                          : payment.paymentStatus.toLowerCase() === 'create'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start">
                      <span>
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </span>
                      <span>
                        {new Date(payment.paymentDate).toLocaleTimeString()}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {pyTotalPage >= 1 && (
        <MyPagination
          currentPage={pyCurrentPage}
          totalPages={pyTotalPage}
          onPageChange={fetchPayments}
        />
      )}
    </Card>
  );
};
