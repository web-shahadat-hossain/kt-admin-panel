import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Lesson } from "@/types/lesson";
import AddLessonModal from "@/components/lesson/AddLessonModal";
import EditLessonModal from "@/components/lesson/EditLessonModal";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchlesson } from "@/store/slices/lesson-slice";
import { MyPagination } from "@/components/ui/my-pagination";
import { LessonsTable } from "@/components/lesson/LessonsTable";
import { Input } from "@/components/ui/input";

const LessonPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const { lessons, isLoading, currentPage, totalPages } = useSelector(
    (state: RootState) => state.lesson
  );

  useEffect(() => {
    handlePageChange(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(fetchlesson({ page: page, search: searchTerm }));
  };

  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Lesson
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search lesson by title"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border bg-white">
        <LessonsTable lessons={lessons} onEdit={handleEdit} />
      </div>

      <AddLessonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditLessonModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lesson={selectedLesson}
      />

      {totalPages >= 1 && (
        <MyPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default LessonPage;
