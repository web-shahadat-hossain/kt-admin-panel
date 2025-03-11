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
import { MyPagination } from '@/components/ui/my-pagination';
import { Input } from '@/components/ui/input';
import { fetchAllTransactions } from '@/store/slices/transaction';

const Transaction = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { transactions, currentPage, totalPages, isLoading } = useSelector(
    (store: RootState) => store.transaction
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = (page: number) => {
    dispatch(fetchAllTransactions({ page: page, search: searchQuery }));
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
          <h1 className="text-2xl font-bold">Transaction Records</h1>
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
              <TableHead>Referral Name</TableHead>
              <TableHead>Referral Mobile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Transaction Type</TableHead>
              <TableHead>Transaction Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              console.log(
                '=========================================',
                transaction
              );
              return (
                <TableRow key={transaction?._id}>
                  <TableCell>{transaction?.referredBy?.name}</TableCell>
                  <TableCell>{transaction?.referredBy?.mobile}</TableCell>
                  <TableCell>{transaction?.referredTo?.name}</TableCell>
                  <TableCell>{transaction?.referredTo?.mobile}</TableCell>
                  <TableCell>₹{transaction?.amount / 100 || 0}</TableCell>
                  <TableCell>{transaction?.points}</TableCell>
                  <TableCell>
                    {transaction?.transactionType === 'C'
                      ? 'Withdraw'
                      : 'Deposit'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start">
                      <span>
                        {new Date(transaction?.date).toLocaleDateString()}
                      </span>
                      <span>
                        {new Date(transaction?.date).toLocaleTimeString()}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
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

export default Transaction;
