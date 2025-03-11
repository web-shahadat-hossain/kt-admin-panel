import { Controller, UseFormReturn } from "react-hook-form";
import { MultiSelectDropdown } from "@/components/ui/MultiSelectDropdown";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Course } from "@/types/offer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { searchEligibleCourses } from "@/store/slices/offer-slice";
import { useEffect, useState } from "react";

interface CourseSelectProps {
  courses: Course[];
  form: UseFormReturn<any>;
  isLoading: boolean;
}

export const CourseSelect = ({
  courses,
  form,
  isLoading,
}: CourseSelectProps) => {
  const courseItems = courses.map((course) => ({
    id: course._id,
    label: course.title,
  }));
  const [search, setSearch] = useState("");

  const dispath = useDispatch<AppDispatch>();

  useEffect(() => {
    handleCourseSearch(search);
  }, [search]);

  const handleCourseSearch = (search: string) => {
    dispath(searchEligibleCourses({ search }));
  };

  return (
    <Controller
      control={form.control}
      name="courses"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Courses</FormLabel>
          <MultiSelectDropdown
            items={courseItems}
            name="courses"
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
