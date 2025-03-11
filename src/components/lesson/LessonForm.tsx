import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MaterialType } from "@/types/lesson";
import { LessonFormData } from "@/lib/validations/lesson-schema";


interface LessonFormProps {
  lesson: LessonFormData;
  updateLesson: (data: Partial<LessonFormData>) => void;
}

const LessonForm = ({ lesson, updateLesson }: LessonFormProps) => {
  return (
    <div className="space-y-4 px-2">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={lesson.title}
          onChange={(e) => updateLesson({ title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={lesson.description}
          onChange={(e) => updateLesson({ description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="materialType">Material Type</Label>
        <Select
          value={lesson.materialType}
          onValueChange={(value: MaterialType) =>
            updateLesson({ materialType: value })
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

      {lesson.materialType !== "none" && (
        <div className="space-y-2">
          <Label htmlFor="materialUrl">Material URL</Label>
          <Input
            id="materialUrl"
            value={lesson.materialUrl}
            onChange={(e) => updateLesson({ materialUrl: e.target.value })}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="isMaterial"
          checked={lesson.isMaterial}
          onCheckedChange={(checked) => updateLesson({ isMaterial: checked })}
        />
        <Label htmlFor="isMaterial">Has Material</Label>
      </div>
    </div>
  );
};

export default LessonForm;