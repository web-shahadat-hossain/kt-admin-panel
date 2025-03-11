import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "@/types/lesson";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { togglelessonStatus } from "@/store/slices/lesson-slice";

interface LessonsTableProps {
  lessons: Lesson[];
  onEdit: (lesson: Lesson) => void;
}

export const LessonsTable = ({ lessons, onEdit }: LessonsTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handeltoggle = (id: string) => {
    dispatch(togglelessonStatus(id));
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Material Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons.map((lesson) => (
            <TableRow key={lesson._id}>
              <TableCell className="font-medium">{lesson.title}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    lesson.materialType === "none" ? "secondary" : "default"
                  }
                >
                  {lesson.materialType}
                </Badge>
              </TableCell>
              <TableCell>
                <Switch
                  checked={lesson.isActive}
                  onCheckedChange={() => {
                    handeltoggle(lesson._id);
                  }}
                  className="data-[state=checked]:bg-green-500"
                />
              </TableCell>
              <TableCell>
                {new Date(lesson.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(lesson)}
                  className="hover:bg-gray-100"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
