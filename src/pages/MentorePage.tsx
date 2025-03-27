import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { MentorFormData } from "@/lib/validations/mentore-schema";
import { MentorData } from "@/types/mentore";
import { AppDispatch, RootState } from "@/store/store";
import { MyPagination } from "@/components/ui/my-pagination";
import { MentoreModal } from "@/components/mentore/Mentoremodel";
import {
  creatementore,
  fetchmentore,
  togglementoreStatus,
  updatementore,
} from "@/store/slices/mentore-slice";
import { Input } from "@/components/ui/input.tsx";

export const MentorePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedmentore, setSelectedmentore] = useState<
    MentorData | undefined
  >();
  const [searchTerm, setSearchTerm] = useState("");

  const { mentors, isLoading, currentPage, totalPages } = useSelector(
    (state: RootState) => state.mentore
  );
  useEffect(() => {
    handlePageChange(1);
  }, [searchTerm]);

  const handleAddClick = () => {
    setSelectedmentore(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (value: MentorData) => {
    setSelectedmentore(value);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedmentore(undefined);
  };

  const handleSubmit = (data: MentorFormData) => {
    console.log("creatementore :>> ", data);
    if (selectedmentore) {
      dispatch(
        updatementore({ id: selectedmentore._id, mentoreData: data })
      ).then((res) => {
        if (res.type == "updatementore/fulfilled") {
          toast({
            title: "Success",
            description: "Mentore updated successfully.",
          });
          handleModalClose();
        }
      });
    } else {
      dispatch(creatementore(data)).then((res) => {
        if (res.type == "creatementore/fulfilled") {
          toast({
            title: "Success",
            description: "Mentore added successfully",
          });
          handleModalClose();
        }
      });
    }
  };

  const handleToggleStatus = (value: MentorData) => {
    dispatch(togglementoreStatus(value._id));
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchmentore({ page: page, search: searchTerm }));
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mentore</h1>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" /> Add Mentore
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search mentor by name, mobile, email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Expertise</TableHead>
              <TableHead>ExperienceYears</TableHead>
              <TableHead>Bio</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : mentors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No Mentore found
                </TableCell>
              </TableRow>
            ) : (
              mentors.map((value) => (
                <TableRow key={value._id}>
                  <TableCell className="font-medium">{value.name}</TableCell>
                  <TableCell>
                    {/* {value.image ? value.image : "-"} */}
                    <img
                      src={
                        value.image
                          ? value.image
                          : "../assets/images/placeholder.webp"
                      }
                      alt={value.name}
                      className="h-13 w-12 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{value.email ? value.email : "-"}</TableCell>
                  <TableCell>{value.mobile ? value.mobile : "-"}</TableCell>
                  <TableCell>{value.expertise.join(", ")}</TableCell>
                  <TableCell>{value.experienceYears}</TableCell>
                  <TableCell>{value.bio}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        value.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {value.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(value)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(value)}
                    >
                      {value.isActive ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
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

      <MentoreModal
        open={isModalOpen}
        onClose={handleModalClose}
        mentore={selectedmentore}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
