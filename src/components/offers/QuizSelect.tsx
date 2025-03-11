import { Controller, UseFormReturn } from "react-hook-form";
import { MultiSelectDropdown } from "@/components/ui/MultiSelectDropdown";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Quiz } from "@/types/offer";
import {
  searchEligibleCourses,
  searchEligibleQuizzes,
} from "@/store/slices/offer-slice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

interface QuizSelectProps {
  quizzes: Quiz[];
  form: UseFormReturn<any>;
  isLoading: boolean;
}

export const QuizSelect = ({ quizzes, form, isLoading }: QuizSelectProps) => {
  const quizItems = quizzes.map((quiz) => ({
    id: quiz._id,
    label: quiz.title,
  }));
  const [search, setSearch] = useState("");

  const dispath = useDispatch<AppDispatch>();

  useEffect(() => {
    handleQuizSearch(search);
  }, [search]);

  const handleQuizSearch = (search: string) => {
    dispath(searchEligibleQuizzes({ search }));
  };

  return (
    <Controller
      control={form.control}
      name="quizzes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Quizzes</FormLabel>
          <MultiSelectDropdown
            items={quizItems}
            name="quizzes"
            control={form.control}
            isLoading={isLoading}
            onSearch={setSearch}
            search={search}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
