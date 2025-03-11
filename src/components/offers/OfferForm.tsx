import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Course, Offer, Quiz } from "@/types/offer";
import { CourseSelect } from "./CourseSelect";
import { QuizSelect } from "./QuizSelect";
import { DateRangeSelect } from "./DateRangeSelect";
import {
  OfferFormSchema,
  offerFormSchema,
} from "@/lib/validations/offer-schema";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import {
  searchEligibleCourses,
  searchEligibleQuizzes,
} from "@/store/slices/offer-slice";

interface OfferFormProps {
  initialData?: Partial<Offer>;
  onSubmit: (data: OfferFormSchema) => void;
}

export function OfferForm({ initialData, onSubmit }: OfferFormProps) {
  const { courses, quizzes, isLoadingCourse, isLoadingQuiz } = useSelector(
    (state: RootState) => state.offer
  );

  const dispath = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof offerFormSchema>>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      image: initialData?.image ?? "",
      offrPer: initialData?.offrPer ?? 0,
      startAt: initialData?.startAt
        ? new Date(initialData.startAt)
        : new Date(),
      endAt: initialData?.endAt ? new Date(initialData.endAt) : new Date(),
      courses: Array.isArray(initialData?.courses) ? initialData.courses : [],
      quizzes: Array.isArray(initialData?.quizzes) ? initialData.quizzes : [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter offer title" {...field} />
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
                <Textarea placeholder="Enter offer description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Image</FormLabel>
              <FormControl>
                <Input placeholder="Enter offer image" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="offrPer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Percentage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter offer percentage"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DateRangeSelect form={form} />
        <CourseSelect
          form={form}
          courses={courses}
          isLoading={isLoadingCourse}
        />
        <QuizSelect form={form} quizzes={quizzes} isLoading={isLoadingQuiz} />

        <Button type="submit" className="w-full">
          {initialData ? "Update Offer" : "Create Offer"}
        </Button>
      </form>
    </Form>
  );
}
