import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/ui/custom-dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BasicQuizInfo } from "./BasicQuizInfo";
import { QuizScheduling } from "./QuizScheduling";
import { QuestionForm } from "./QuestionForm";
import { QuizMetadata } from "./QuizMetadata";
import { QuizFormSchema, quizFormSchema } from "@/lib/validations/quiz-schema";
import { useToast } from "@/components/ui/use-toast";
import { Quiz } from "@/types/quiz";

interface EditQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: Quiz | null;
}

export const EditQuizDialog = ({
  open,
  onOpenChange,
  quiz,
}: EditQuizDialogProps) => {
  const { toast } = useToast();

  if (!quiz) return null;

  const form = useForm<QuizFormSchema>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: quiz.title,
      description: quiz.description || "",
      startDate: new Date(quiz.startDate),
      endDate: new Date(quiz.endDate),
      duration: quiz.duration,
      price: quiz.price,
      isActive: quiz.isActive,
      questions: quiz.questions || [],
      standard: quiz.standard,
      subject: quiz.subject,
      ageGroup: quiz.ageGroup,
    },
  });

  const onSubmit = (data: QuizFormSchema) => {
    console.log("Form submitted:", data);
    // toast({
    //   title: "Quiz Updated",
    //   description: "The quiz has been successfully updated.",
    // });
    // onOpenChange(false);
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogContent
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <CustomDialogHeader>
          <CustomDialogTitle>Edit Quiz: {quiz.title}</CustomDialogTitle>
        </CustomDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicQuizInfo form={form} />
            <QuizMetadata form={form} />
            <QuizScheduling form={form} />
            <QuestionForm form={form} />

            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CustomDialogContent>
    </CustomDialog>
  );
};
