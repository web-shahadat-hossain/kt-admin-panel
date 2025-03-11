import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { QuizFormSchema } from "@/lib/validations/quiz-schema";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { fetchAllStandards } from "@/store/slices/standard-slice";
import { fetchAllsubject } from "@/store/slices/subject-slice";
import { DynamicDropdown } from "../ui/dynamic-dropdown";
import { get } from "http";

interface QuizMetadataProps {
  form: UseFormReturn<QuizFormSchema>;
}

export function QuizMetadata({ form }: QuizMetadataProps) {
  const { standards, isLoading } = useSelector(
    (state: RootState) => state.standard
  );

  const { subjects, isLoading: subLoading } = useSelector(
    (state: RootState) => state.subject
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    fetchStandards();
    getSubject("");
  }, []);

  const fetchStandards = () => {
    dispatch(fetchAllStandards());
  };

  const getSubject = (stdId: string) => {
    dispatch(fetchAllsubject(stdId));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="standard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Standard</FormLabel>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <DynamicDropdown
                  placeholder="Select standard"
                  name="standard"
                  control={form.control}
                  onSearch={() => {}}
                  listing={standards.map((item) => ({
                    id: item._id,
                    label: item.std,
                  }))}
                  onItemSelect={(id) => getSubject(id)}
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              {subLoading ? (
                <div>Loading...</div>
              ) : (
                <DynamicDropdown
                  placeholder="Select subject"
                  name="subject"
                  control={form.control}
                  onSearch={() => {}}
                  listing={subjects.map((item) => ({
                    id: item._id,
                    label: item.standard
                      ? item.subject + " - " + item.standard?.std
                      : item.subject,
                  }))}
                  onItemSelect={(id) => {}}
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="ageGroup"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age Group</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 8-12 years" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                min={0}
                step={1}
                type="number"
                placeholder="0"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Active Status</FormLabel>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      /> */}
    </div>
  );
}
