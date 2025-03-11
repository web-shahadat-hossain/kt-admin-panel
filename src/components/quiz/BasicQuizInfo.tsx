import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { QuizFormSchema } from '@/lib/validations/quiz-schema';
import { UseFormReturn } from 'react-hook-form';

interface BasicQuizInfoProps {
  form: UseFormReturn<QuizFormSchema>;
}

export function BasicQuizInfo({ form }: BasicQuizInfoProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter quiz title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter quiz description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bonusPercent"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Refer Percentage</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter refer bonus percentage"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
