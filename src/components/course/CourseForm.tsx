// import { useFieldArray, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   type CourseFormValues,
//   courseSchema,
// } from '@/lib/validations/course-schema';
// import { Course } from '@/types/course';
// import { fetchAllStandards } from '@/store/slices/standard-slice';
// import { fetchAllsubject } from '@/store/slices/subject-slice';
// import { AppDispatch, RootState } from '@/store/store';
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { DynamicDropdown } from '../ui/dynamic-dropdown';

// interface CourseFormProps {
//   initialData?: Course;
//   onSubmit: (data: CourseFormValues) => void;
//   onCancel: () => void;
// }

// export function CourseForm({
//   initialData,
//   onSubmit,
//   onCancel,
// }: CourseFormProps) {
//   const { standards, isLoading } = useSelector(
//     (state: RootState) => state.standard
//   );

//   const { subjects, isLoading: subLoading } = useSelector(
//     (state: RootState) => state.subject
//   );

//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     dispatch(fetchAllStandards());
//     getSubject('');
//   }, []); //subjects, stdId

//   const getSubject = (stdId: string) => {
//     dispatch(fetchAllsubject(stdId));
//   };

//   const form = useForm<CourseFormValues>({
//     resolver: zodResolver(courseSchema),
//     defaultValues: {
//       title: '',
//       description: '',
//       price: 0,
//       duration: '',
//       features: [''],
//       thumbnail: '',
//       standard: '',
//       subject: '',
//       board: '',
//       skillLevel: 'Beginner',
//       lessons: [],
//       isActive: true,
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: 'features',
//   });

//   useEffect(() => {
//     if (initialData) {
//       Object.keys(initialData).forEach((key) => {
//         if (key == 'standard') {
//           form.setValue(key as keyof CourseFormValues, initialData[key]._id);
//         } else if (key == 'subject') {
//           form.setValue(key as keyof CourseFormValues, initialData[key]._id);
//         } else {
//           form.setValue(key as keyof CourseFormValues, initialData[key]);
//         }
//       });
//     } else {
//       form.clearErrors();
//       form.reset();
//     }
//   }, [initialData, form]);

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <FormField
//           control={form.control}
//           name="title"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Title</FormLabel>
//               <FormControl>
//                 <Input placeholder="Course title" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Textarea placeholder="Course description" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Price</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     placeholder="0"
//                     {...field}
//                     onChange={(e) => field.onChange(Number(e.target.value))}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="duration"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Duration</FormLabel>
//                 <FormControl>
//                   <Input placeholder="e.g., 2 months" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={form.control}
//           name="thumbnail"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Thumbnail URL</FormLabel>
//               <FormControl>
//                 <Input placeholder="https://..." {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="standard"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Standard</FormLabel>
//                 {isLoading ? (
//                   <div>Loading...</div>
//                 ) : (
//                   <DynamicDropdown
//                     placeholder="Select standard"
//                     name="standard"
//                     control={form.control}
//                     onSearch={() => {}}
//                     listing={standards.map((item) => ({
//                       id: item._id,
//                       label: item.std,
//                     }))}
//                     onItemSelect={(id) => getSubject(id)}
//                   />
//                 )}
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="subject"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Subject</FormLabel>
//                 {subLoading ? (
//                   <div>Loading...</div>
//                 ) : (
//                   <DynamicDropdown
//                     placeholder="Select subject"
//                     name="subject"
//                     control={form.control}
//                     onSearch={() => {}}
//                     listing={subjects.map((item) => ({
//                       id: item._id,
//                       label: item.standard
//                         ? item.subject + ' - ' + item.standard?.std
//                         : item.subject,
//                     }))}
//                     onItemSelect={(id) => {}}
//                   />
//                 )}
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={form.control}
//           name="board"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Board</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter board name" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="skillLevel"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Skill Level</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select skill level" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="Beginner">Beginner</SelectItem>
//                   <SelectItem value="Intermediate">Intermediate</SelectItem>
//                   <SelectItem value="Advanced">Advanced</SelectItem>
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* <FormField
//           control={form.control}
//           name="isActive"
//           render={({ field }) => (
//             <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//               <div className="space-y-0.5">
//                 <FormLabel className="text-base">Active Status</FormLabel>
//                 <div className="text-sm text-muted-foreground">
//                   Make this course visible to students
//                 </div>
//               </div>
//               <FormControl>
//                 <Switch
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                 />
//               </FormControl>
//             </FormItem>
//           )}
//         /> */}

//         <FormField
//           control={form.control}
//           name="features"
//           render={() => (
//             <FormItem>
//               <FormLabel>Features</FormLabel>
//               {fields.map((field, index) => (
//                 <div key={field.id} className="flex items-center space-x-2">
//                   <FormControl>
//                     <Input
//                       {...form.register(`features.${index}`)}
//                       placeholder="Feature"
//                     />
//                   </FormControl>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => remove(index)}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               ))}
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => append('')}
//                 className="mt-2"
//               >
//                 Add Feature
//               </Button>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="flex justify-end space-x-4">
//           <Button variant="outline" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button type="submit">
//             {initialData ? 'Update Course' : 'Add Course'}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type CourseFormValues,
  courseSchema,
} from '@/lib/validations/course-schema';
import { Course } from '@/types/course';
import { fetchAllStandards } from '@/store/slices/standard-slice';
import { fetchAllsubject } from '@/store/slices/subject-slice';
import { AppDispatch, RootState } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DynamicDropdown } from '../ui/dynamic-dropdown';
import { fetchAllboard } from '@/store/slices/board-slice';

interface CourseFormProps {
  initialData?: Course;
  onSubmit: (data: CourseFormValues) => void;
  onCancel: () => void;
}

export function CourseForm({
  initialData,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const { standards, isLoading } = useSelector(
    (state: RootState) => state.standard
  );

  const { subjects, isLoading: subLoading } = useSelector(
    (state: RootState) => state.subject
  );

  const { board, isLoading: boardLoading } = useSelector(
    (state: RootState) => state.board
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllStandards());
    dispatch(fetchAllboard());
    getSubject('');
  }, []);

  const getSubject = (stdId: string) => {
    dispatch(fetchAllsubject(stdId));
  };

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      duration: '',
      features: [''],
      thumbnail: '',
      standard: '',
      subject: '',
      boardId: '',
      skillLevel: 'Beginner',
      lessons: [],
      isActive: true,
      bookPDF: [],
      bonusPercent: 0,
      // Initialize as an empty array (optional)
    },
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control: form.control,
    name: 'features',
  });

  const {
    fields: pdfFields,
    append: appendPdf,
    remove: removePdf,
  } = useFieldArray({
    control: form.control,
    name: 'bookPDF',
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        if (key === 'standard') {
          form.setValue(key as keyof CourseFormValues, initialData[key]._id);
        } else if (key === 'subject') {
          form.setValue(key as keyof CourseFormValues, initialData[key]._id);
        } else if (key === 'bookPDF') {
          // Set bookPDF only if it exists in initialData
          form.setValue(key as keyof CourseFormValues, initialData[key] || []);
        } else {
          form.setValue(key as keyof CourseFormValues, initialData[key]);
        }
      });
    } else {
      form.clearErrors();
      form.reset();
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Course title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Course description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price and Duration */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
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

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2 months" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Thumbnail URL */}
        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Standard and Subject */}
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
                        ? item.subject + ' - ' + item.standard?.std
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

        {/* Board */}
        <FormField
          control={form.control}
          name="boardId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board</FormLabel>
              {boardLoading ? (
                <div>Loading...</div>
              ) : (
                <DynamicDropdown
                  placeholder="Select board"
                  name="boardId"
                  control={form.control}
                  onSearch={() => {}}
                  listing={board.map((item) => ({
                    id: item._id, // Use _id as the unique identifier
                    label: item.boardname, // Use boardname as the display label
                  }))}
                  onItemSelect={(id) => {
                    // Handle board selection if needed
                    console.log('Selected board ID:', id);
                  }}
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* refer percent */}
        <FormField
          control={form.control}
          name="bonusPercent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refer Bonus Percentage</FormLabel>
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

        {/* Skill Level */}
        <FormField
          control={form.control}
          name="skillLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Features */}
        <FormField
          control={form.control}
          name="features"
          render={() => (
            <FormItem>
              <FormLabel>Features</FormLabel>
              {featureFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <FormControl>
                    <Input
                      {...form.register(`features.${index}`)}
                      placeholder="Feature"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeFeature(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendFeature('')}
                className="mt-2"
              >
                Add Feature
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Book PDF Links (Optional) */}
        <FormField
          control={form.control}
          name="bookPDF"
          render={() => (
            <FormItem>
              <FormLabel>Book PDF Links (Optional)</FormLabel>
              {pdfFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <FormControl>
                    <Input
                      {...form.register(`bookPDF.${index}`)}
                      placeholder="PDF Link"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removePdf(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendPdf('')}
                className="mt-2"
              >
                Add PDF Link
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Course' : 'Add Course'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
