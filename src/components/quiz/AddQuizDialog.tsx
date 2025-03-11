import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { BasicQuizInfo } from './BasicQuizInfo';
import { QuizScheduling } from './QuizScheduling';
import { QuestionForm } from './QuestionForm';
import { QuizFormSchema, quizFormSchema } from '@/lib/validations/quiz-schema';
import { QuizMetadata } from './QuizMetadata';
import { useToast } from '@/components/ui/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { createQuiz, updateQuiz } from '@/store/slices/quiz-slice';
import { Quiz } from '@/types/quiz';
import { useEffect } from 'react';

interface AddQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editQuiz?: Quiz;
}

export function AddQuizDialog({
  open,
  onOpenChange,
  editQuiz,
}: AddQuizDialogProps) {
  const { toast } = useToast();

  const { isLoading } = useSelector((state: RootState) => state.quiz);

  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<QuizFormSchema>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      duration: 0,
      ageGroup: '',
      standard: '',
      subject: '',
      price: 0,
      isActive: true,
      questions: [],
      bonusPercent: 0,
    },
  });

  useEffect(() => {
    if (editQuiz) {
      // Set form values when editing
      form.setValue('title', editQuiz.title);
      form.setValue('description', editQuiz.description);
      form.setValue('startDate', new Date(editQuiz.startDate));
      form.setValue('endDate', new Date(editQuiz.endDate));
      form.setValue('duration', editQuiz.duration);
      form.setValue('ageGroup', editQuiz.ageGroup);
      form.setValue('standard', editQuiz.standard);
      form.setValue('subject', editQuiz.subject);
      form.setValue('price', editQuiz.price);
      form.setValue('bonusPercent', editQuiz?.bonusPercent);
      form.setValue('isActive', editQuiz.isActive);
      form.setValue('questions', editQuiz.questions);
    } else {
      form.reset();
    }
  }, [editQuiz, form]);

  const onSubmit = (data: QuizFormSchema) => {
    const sanitizedData = {
      ...data,
      subject: data.subject === '' ? null : data.subject,
      standard: data.standard === '' ? null : data.standard,
    };

    if (editQuiz) {
      dispatch(updateQuiz({ id: editQuiz._id, quizData: sanitizedData }))
        .then((res) => {
          if (res.type == 'quiz/updateQuiz/fulfilled') {
            toast({
              title: 'Quiz Updated',
              description: 'The quiz has been successfully updated.',
            });
            clearForm();
            onOpenChange(false);
          }
        })
        .catch((error) => {});
    } else {
      dispatch(createQuiz(sanitizedData))
        .then((res) => {
          if (res.type == 'quiz/createQuiz/fulfilled') {
            toast({
              title: 'Quiz Created',
              description: 'The quiz has been successfully created.',
            });
            clearForm();
            onOpenChange(false);
          }
        })
        .catch((error) => {});
    }
  };

  const clearForm = () => {
    form.clearErrors();
    form.reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        clearForm();
        onOpenChange(open);
      }}
    >
      <DialogContent
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add New Quiz</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicQuizInfo form={form} />
            <QuizMetadata form={form} />
            <QuizScheduling form={form} />
            <QuestionForm form={form} />

            <div className="flex justify-end space-x-2">
              <Button
                type="reset"
                variant="outline"
                onClick={() => {
                  clearForm();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? 'Submitting ....'
                  : editQuiz
                  ? 'Update Quiz'
                  : 'Add Quiz'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
