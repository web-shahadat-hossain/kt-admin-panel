import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

import { createlesson } from "@/store/slices/lesson-slice";
import { useToast } from "@/components/ui/use-toast";
import { LessonFormData } from "@/lib/validations/lesson-schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LessonChips from "./LessonChips";
import LessonForm from "./LessonForm";
import { fetchCourses } from "@/store/slices/course-slice";
import { fetchAllStandards } from "@/store/slices/standard-slice";
import { fetchAllsubject } from "@/store/slices/subject-slice";
import { fetchAllboard } from "@/store/slices/board-slice";
import { Plus } from "lucide-react";

const AddLessonModal = ({ isOpen, onClose }) => {
  const [lessons, setLessons] = useState<LessonFormData[]>([
    {
      title: "",
      description: "",
      materialType: "none",
      materialUrl: "",
      isMaterial: false,
      courseId: "",
      standard: "",
      subject: "",
      boardId: "",
    },
  ]);

  console.log(lessons);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState("");
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCourses({ page: 1, search: "" }));
      dispatch(fetchAllStandards());
      dispatch(fetchAllsubject());
      dispatch(fetchAllboard());
    }
  }, [isOpen, dispatch]);

  const { courses, standards, subjects } = useSelector((state: RootState) => ({
    courses: state.course.courses,
    standards: state.standard.standards,
    subjects: state.subject.subjects,
  }));
  const { board, isLoading: boardLoading } = useSelector(
    (state: RootState) => state.board
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        createlesson({ courseId: selectedCourse, lessons })
      );
      if (createlesson.fulfilled.match(resultAction)) {
        toast({ title: "Success", description: "Lessons added successfully" });
        onClose();
      } else {
        throw new Error("Failed to save lessons");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save lessons",
        variant: "destructive",
      });
    }
  };

  const addNewLesson = () => {
    setLessons([
      ...lessons,
      {
        title: "",
        description: "",
        materialType: "none",
        materialUrl: "",
        isMaterial: false,
        courseId: "",
        standard: "",
        subject: "",
        boardId: "",
      },
    ]);
    setCurrentIndex(lessons.length);
  };

  const removeLesson = (index) => {
    const newLessons = lessons.filter((_, i) => i !== index);
    setLessons(newLessons);
    if (currentIndex >= index && currentIndex > 0)
      setCurrentIndex(currentIndex - 1);
  };

  const updateLesson = (index, data) => {
    const newLessons = lessons.map((lesson, i) =>
      i === index ? { ...lesson, ...data } : lesson
    );
    setLessons(newLessons);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Lessons</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mb-4 px-2">
          <div className="space-y-2">
            <Label htmlFor="course">Select Course</Label>
            <Select
              value={lessons[currentIndex].courseId || ""}
              onValueChange={(value) =>
                updateLesson(currentIndex, { courseId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="standard">Select Standard</Label>
            <Select
              value={lessons[currentIndex].standard || ""}
              onValueChange={(value) =>
                updateLesson(currentIndex, { standard: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a standard" />
              </SelectTrigger>
              <SelectContent>
                {standards.map((standard) => (
                  <SelectItem key={standard._id} value={standard._id}>
                    {standard.std}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Select Subject</Label>
            <Select
              value={lessons[currentIndex].subject || ""}
              onValueChange={(value) =>
                updateLesson(currentIndex, { subject: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject._id} value={subject._id}>
                    {subject.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="board">Select Board</Label>
            <Select
              value={lessons[currentIndex].boardId || ""}
              onValueChange={(value) =>
                updateLesson(currentIndex, { boardId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a board" />
              </SelectTrigger>
              <SelectContent>
                {board?.map((board) => (
                  <SelectItem key={board._id} value={board._id}>
                    {board.boardname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-4 mb-4 px-2">
          <LessonChips
            lessons={lessons}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            removeLesson={removeLesson}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={addNewLesson}
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex-1 overflow-y-auto"
        >
          <LessonForm
            lesson={lessons[currentIndex]}
            updateLesson={(data) => updateLesson(currentIndex, data)}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Lessons</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLessonModal;
