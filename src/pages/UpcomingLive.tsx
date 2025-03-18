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
import {
  ApiBaseurl,
  GET_UPCOMING_LIVE,
  START_STREAM,
} from '@/utils/constants/ApiEndPoints';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

function UpcomingLive() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [UpcomingLives, setUpcomingLives] = useState([]);

  const fetchUpcomingLive = async () => {
    try {
      const response = await axios.get(ApiBaseurl + GET_UPCOMING_LIVE, {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      });
      const data = response.data.data;

      setUpcomingLives(data);
    } catch (error) {
      console.error('Error fetching UpcomingLive:', error);
      setUpcomingLives([]); // Set empty array on error to prevent map() failure
    }
  };

  useEffect(() => {
    fetchUpcomingLive();
  }, []);

  const startStream = async (id) => {
    try {
      const response = await axios.post(
        ApiBaseurl + START_STREAM(id),
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );

      if (response?.data?.data?.isLive) {
        fetchUpcomingLive();
        navigate(`/dashboard/live/${id}`);
        toast({
          title: 'Toast Created',
          description: 'The Live is Started successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Live error',
        description: error.response.data.error || 'Something went wrong',
      });
    }
  };

  return (
    <div className="p-4">
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
              <TableHead>Title</TableHead>
              <TableHead>Standard</TableHead>
              <TableHead>Board</TableHead>
              <TableHead>Stream Key</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Is Live</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {UpcomingLives.length > 0 ? (
              UpcomingLives.map((upcomingLive) => {
                console.log(upcomingLive);
                return (
                  <TableRow key={upcomingLive?._id}>
                    <TableCell>{upcomingLive?.title}</TableCell>
                    <TableCell>{upcomingLive?.standard?.std}</TableCell>
                    <TableCell>{upcomingLive?.boardId?.boardname}</TableCell>
                    <TableCell>{upcomingLive?.streamKey}</TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start">
                        <span>
                          {new Date(
                            upcomingLive?.startDate
                          ).toLocaleDateString()}
                        </span>
                        <span>
                          {new Date(
                            upcomingLive?.startDate
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{upcomingLive?.isLive ? 'Yes' : 'No'}</TableCell>

                    <TableCell>
                      <button
                        onClick={() => startStream(upcomingLive?._id)}
                        className="px-2 py-1 bg-blue-600 text-white rounded-md text-sm"
                      >
                        Go Live
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell className="text-center">
                  No Upcoming Live Streams
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <StreamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refetch={fetchUpcomingLive}
      />
    </div>
  );
}

export default UpcomingLive;
