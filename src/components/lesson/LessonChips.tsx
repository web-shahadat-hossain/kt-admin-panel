import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LessonFormData } from "@/lib/validations/lesson-schema";
import { X } from "lucide-react";

interface LessonChipsProps {
  lessons: LessonFormData[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  removeLesson: (index: number) => void;
}

const LessonChips = ({
  lessons,
  currentIndex,
  setCurrentIndex,
  removeLesson,
}: LessonChipsProps) => {
  return (
    <ScrollArea className="h-[60px] w-full ">
      <div className="flex gap-2 p-1  flex-wrap">
        {lessons.map((lesson, index) => (
          <Badge
            key={index}
            variant={currentIndex === index ? "default" : "secondary"}
            className="cursor-pointer whitespace-nowrap flex items-center "
            onClick={() => setCurrentIndex(index)}
          >
            {lesson.title || `Lesson ${index + 1}`}
            {lessons.length > 1 && (
              <X
                className="h-3 w-3 ml-1 inline-block"
                onClick={(e) => {
                  e.stopPropagation();
                  removeLesson(index);
                }}
              />
            )}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  );
};

export default LessonChips;
