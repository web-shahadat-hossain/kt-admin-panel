import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchAllUsers,
  toggleUserBlock,
  updateUser,
} from "@/store/slices/users-slice";
import { MyPagination } from "@/components/ui/my-pagination";
import { User, UserUpdate } from "@/types/user";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { UserTable } from "@/components/users/UserTable";
import { Input } from "@/components/ui/input";

const Users = () => {
  const [open, setOpen] = useState(false);

  const [editableUser, setEditableUser] = useState<User | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const { users, isLoading, currentPage, totalPages } = useSelector(
    (store: RootState) => store.user
  );

  const dispath = useDispatch<AppDispatch>();

  useEffect(() => {
    handleSearch(1);
  }, [searchTerm]);

  const handleSearch = (page: number) => {
    dispath(fetchAllUsers({ page: page, search: searchTerm }));
  };

  const handleToggleStatus = (userId: string) => {
    dispath(toggleUserBlock(userId));
  };

  const handleEdit = (user: User) => {
    setEditableUser(user);
    setOpen(true);
  };

  const handleUpdate = (data: UserUpdate) => {
    dispath(
      updateUser({ mobile: data.mobile, dob: data.dob, balance: data.balance })
    ).then((res) => {
      if (res.type === "updateUser/fulfilled") {
        setOpen(false);
        toast({
          title: "User updated successfully",
          description: "User details has been updated successfully",
        });
      }
    });
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search user by mobile"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="max-w-sm"
        />
      </div>

      <AddUserDialog
        open={open}
        setOpen={setOpen}
        defaultValues={editableUser}
        onUpdate={handleUpdate}
      />

      <UserTable
        users={users}
        isLoading={isLoading}
        handleEdit={handleEdit}
        handleToggleStatus={handleToggleStatus}
      />

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

export default Users;
