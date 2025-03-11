import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { QuizFormSchema } from "@/lib/validations/quiz-schema";

interface QuestionFormProps {
  form: UseFormReturn<QuizFormSchema>;
}

export function QuestionForm({ form }: QuestionFormProps) {
  const questions = form.watch("questions") || [];

  const addQuestion = () => {
    const currentQuestions = form.getValues("questions") || [];
    form.setValue("questions", [
      ...currentQuestions,
      {
        question: "",
        options: [
          { option: "", isCorrect: true },
          { option: "", isCorrect: false },
        ],
      },
    ]);
  };

  const addOption = (questionIndex: number) => {
    const currentQuestions = form.getValues("questions");
    const updatedQuestions = [...currentQuestions];
    updatedQuestions[questionIndex].options.push({
      option: "",
      isCorrect: false,
    });
    form.setValue("questions", updatedQuestions);
  };

  const removeQuestion = (questionIndex: number) => {
    const currentQuestions = form.getValues("questions");
    const updatedQuestions = currentQuestions.filter(
      (_, index) => index !== questionIndex
    );
    form.setValue("questions", updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentQuestions = form.getValues("questions");
    const updatedQuestions = [...currentQuestions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, index) => index !== optionIndex);
    form.setValue("questions", updatedQuestions);
  };

  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    const currentQuestions = form.getValues("questions");
    const updatedQuestions = [...currentQuestions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.map((option, index) => ({
      ...option,
      isCorrect: index === optionIndex,
    }));
    form.setValue("questions", updatedQuestions);
  };

  return (
    <div className="space-y-6">
      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="p-4 border rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Question {questionIndex + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeQuestion(questionIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <FormField
            control={form.control}
            name={`questions.${questionIndex}.question`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Text</FormLabel>
                <FormControl>
                  <Input placeholder="Enter question" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Options</FormLabel>
            <RadioGroup
              onValueChange={(value) =>
                setCorrectOption(questionIndex, parseInt(value))
              }
              value={question?.options
                ?.findIndex((opt) => opt.isCorrect)
                .toString()}
            >
              {question?.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={optionIndex.toString()}
                    id={`q${questionIndex}-opt${optionIndex}`}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${questionIndex}.options.${optionIndex}.option`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder={`Option ${optionIndex + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {question.options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(questionIndex, optionIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </RadioGroup>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addOption(questionIndex)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addQuestion}>
        <Plus className="h-4 w-4 mr-2" />
        Add Question
      </Button>
    </div>
  );
}
