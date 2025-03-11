import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchAllPayment } from '@/store/slices/payment-slice';
import { MyPagination } from '@/components/ui/my-pagination';
import { Input } from '@/components/ui/input';

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { payments, currentPage, totalPages, isLoading } = useSelector(
    (store: RootState) => store.payment
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = (page: number) => {
    dispatch(fetchAllPayment({ page: page, search: searchQuery }));
  };

  useEffect(() => {
    if (searchQuery.length === 0 || searchQuery.length === 10) {
      handleSearch(1);
    }
  }, [searchQuery]);

  return (
    <div className="space-y-6 page-transition">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Payment Records</h1>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search user by mobile"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          className="max-w-sm"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell>
                  {payment.quizId
                    ? payment.quizId.title
                    : payment?.courseId?.title}
                </TableCell>
                <TableCell>{payment.quizId ? 'Quiz' : 'Course'}</TableCell>
                <TableCell>{payment.userId.mobile}</TableCell>
                <TableCell>₹{payment.amount / 100}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages >= 1 && (
        <MyPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handleSearch}
        />
      )}
    </div>
  );
};

export default Payments;
