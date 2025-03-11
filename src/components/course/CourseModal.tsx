import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseForm } from "./CourseForm";
import { CourseFormValues } from "@/lib/validations/course-schema";
import { Course } from "@/types/course";

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  course?: Course;
  onSubmit: (data: CourseFormValues) => void;
}

export function CourseModal({
  open,
  onClose,
  course,
  onSubmit,
}: CourseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Add New Course"}</DialogTitle>
        </DialogHeader>
        <CourseForm
          initialData={course}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
