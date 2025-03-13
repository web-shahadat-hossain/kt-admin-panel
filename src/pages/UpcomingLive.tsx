import React, { useEffect, useState } from 'react';
import StreamModal from './StreamModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { fetchAllTransactions } from '@/store/slices/transaction';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';

function UpcomingLive() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [streamData, setStreamData] = useState({
    title: 'My Live Stream',
    playbackUrl: 'https://example.com/stream',
    streamKey: 'abc123xyz',
    isLive: true,
    startDate: '2025-03-15',
    upcomming: false,
    createdAt: '2025-03-10T08:30:45Z',
    updatedAt: '2025-03-12T14:22:10Z',
  });

  const [searchQuery, setSearchQuery] = useState('');

  const { transactions } = useSelector((store: RootState) => store.transaction);

  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = (page: number) => {
    dispatch(fetchAllTransactions({ page: page, search: searchQuery }));
  };

  useEffect(() => {
    if (searchQuery.length === 0 || searchQuery.length === 10) {
      handleSearch(1);
    }
  }, [searchQuery]);

  const handleSaveData = (updatedData) => {
    setStreamData(updatedData);
    console.log('Saved data:', updatedData);
    // Here you would typically send the data to your API
  };

  return (
    <div className="p-4">
      {/* <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Add Up Coming Live
      </button> */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">Upcoming Live</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add Up Coming Live
        </button>
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

      <StreamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={streamData}
        onSave={handleSaveData}
      />
    </div>
  );
}

export default UpcomingLive;
