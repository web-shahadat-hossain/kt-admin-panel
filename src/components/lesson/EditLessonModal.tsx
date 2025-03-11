import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Lesson, MaterialType } from "@/types/lesson";
import { LessonFormData } from "@/lib/validations/lesson-schema";
import { updatelesson } from "@/store/slices/lesson-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useToast } from "@/hooks/use-toast";

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
}

const EditLessonModal = ({ isOpen, onClose, lesson }: EditLessonModalProps) => {
  const [formData, setFormData] = useState<LessonFormData>({
    title: "",
    description: "",
    materialType: "none",
    materialUrl: "",
    isMaterial: false,
    courseId: "",
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        description: lesson.description,
        materialType: lesson.materialType,
        materialUrl: lesson.materialUrl,
        isMaterial: lesson.isMaterial,
        courseId: lesson.courseId,
      });
    }
  }, [lesson]);

  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData, "edit data");
    onClose();

    try {
      const resultAction = dispatch(
        updatelesson({ id: lesson._id, courseData: formData })
      );

      if (updatelesson.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: "Lesson updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update lesson",
        variant: "destructive",
      });
    }
  };

  if (!lesson) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialType">Material Type</Label>
            <Select
              value={formData.materialType}
              onValueChange={(value: MaterialType) =>
                setFormData({ ...formData, materialType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select material type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.materialType !== "none" && (
            <div className="space-y-2">
              <Label htmlFor="materialUrl">Material URL</Label>
              <Input
                id="materialUrl"
                value={formData.materialUrl}
                onChange={(e) =>
                  setFormData({ ...formData, materialUrl: e.target.value })
                }
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="isMaterial"
              checked={formData.isMaterial}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isMaterial: checked })
              }
            />
            <Label htmlFor="isMaterial">Has Material</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLessonModal;
