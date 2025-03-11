import { Edit2, Ban, Eye } from 'lucide-react';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '../ui/table';
import { Button } from '../ui/button';
import { User } from '@/types/user';
import { useNavigate } from 'react-router-dom';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  handleEdit: (user: User) => void;
  handleToggleStatus: (userId: string) => void;
}

export const UserTable = ({
  users,
  isLoading,
  handleEdit,
  handleToggleStatus,
}: UserTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mobile</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Language</TableHead>
            <TableHead> Point</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Refer Code</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>{user.userRole}</TableCell>
                <TableCell>
                  {user.dob ? new Date(user.dob).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start">{user.lang}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start">
                    {user?.points}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start">
                    {user?.balance}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start">
                    {user.referralCode}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                  {user.isBlocked && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 ms-2`}
                    >
                      Blocked
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start">
                    <span>
                      {new Date(user.lastLoginAt).toLocaleDateString()}
                    </span>
                    <span>
                      {new Date(user.lastLoginAt).toLocaleTimeString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(user._id)}
                          >
                            {user.isBlocked ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </Button> */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(user._id)}
                    >
                      <Ban className="h-4 w-4 text-red-600" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        navigate(`/dashboard/userDetails/${user._id}`);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
