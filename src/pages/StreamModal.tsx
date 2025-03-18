// import React, { useEffect, useState } from 'react';
// import { X } from 'lucide-react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import {
//   ApiBaseurl,
//   CREATE_UPCOMING_LIVE,
// } from '@/utils/constants/ApiEndPoints';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/store/store';
// import { fetchAllStandards } from '@/store/slices/standard-slice';
// import { fetchAllboard } from '@/store/slices/board-slice';
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   Form,
// } from '@/components/ui/form';
// import { DynamicDropdown } from '@/components/ui/dynamic-dropdown';
// import { useFieldArray, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';

// import * as z from 'zod';
// import { Input } from '@/components/ui/input';

// const LiveSchema = z.object({
//   title: z.string().min(1, 'Title is required'),

//   standard: z.string().min(1, 'Standard is required'),
//   subject: z.string().min(1, 'Subject is required'),
//   boardId: z.string().min(1, 'Board is required'),
//   startDate: z.string().min(1, 'Board is required'),
// });

// const StreamModal = ({ isOpen, onClose, refetch = () => {} }) => {
//   const { standards, isLoading } = useSelector(
//     (state: RootState) => state.standard
//   );

//   const { board, isLoading: boardLoading } = useSelector(
//     (state: RootState) => state.board
//   );

//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     dispatch(fetchAllStandards());
//     dispatch(fetchAllboard());
//   }, []);

//   const form = useForm({
//     resolver: zodResolver(LiveSchema),
//     defaultValues: {
//       title: '',

//       standard: '',
//       boardId: '',
//       // startDate: new Date().toISOString().split('T')[0],
//       startDate: '',
//     },
//   });

//   const handleSubmit = async (data) => {
//     console.log('Data..........///', data);
//     return;
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         ApiBaseurl + CREATE_UPCOMING_LIVE,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${Cookies.get('accessToken')}`,
//           },
//         }
//       );
//       refetch();
//       onClose();
//     } catch (error) {
//       console.error('Error fetching UpcomingLive:', error);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
//         <div className="flex justify-between items-center border-b p-4">
//           <h2 className="text-xl font-semibold text-gray-800">
//             Upcoming Live Details
//           </h2>
//           <button
//             onClick={onClose}
//             className="rounded-full p-1 hover:bg-gray-200 transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-6 p-10"
//           >
//             <div className="space-y-4">
//               {/* Title */}
//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Title</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Course title" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="startDate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Start Date</FormLabel>
//                     <FormControl>
//                       {/* <input
//                         {...field}
//                         id="startDate"
//                         name="startDate"
//                         type="datetime-local"
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         // required
//                       /> */}
//                       <Input {...field} type="datetime-local" />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Standard and Subject */}
//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="standard"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Standard</FormLabel>
//                     {isLoading ? (
//                       <div>Loading...</div>
//                     ) : (
//                       <DynamicDropdown
//                         placeholder="Select standard"
//                         name="standard"
//                         control={form.control}
//                         onSearch={() => {}}
//                         listing={standards.map((item) => ({
//                           id: item._id,
//                           label: item.std,
//                         }))}
//                         onItemSelect={(id) => {}}
//                       />
//                     )}
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Board */}
//             <FormField
//               control={form.control}
//               name="boardId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Board</FormLabel>
//                   {boardLoading ? (
//                     <div>Loading...</div>
//                   ) : (
//                     <DynamicDropdown
//                       placeholder="Select board"
//                       name="boardId"
//                       control={form.control}
//                       onSearch={() => {}}
//                       listing={board.map((item) => ({
//                         id: item._id, // Use _id as the unique identifier
//                         label: item.boardname, // Use boardname as the display label
//                       }))}
//                       onItemSelect={(id) => {
//                         // Handle board selection if needed
//                         console.log('Selected board ID:', id);
//                       }}
//                     />
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div className="mt-6 flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 Save
//               </button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default StreamModal;

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  ApiBaseurl,
  CREATE_UPCOMING_LIVE,
} from '@/utils/constants/ApiEndPoints';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchAllStandards } from '@/store/slices/standard-slice';
import { fetchAllboard } from '@/store/slices/board-slice';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { DynamicDropdown } from '@/components/ui/dynamic-dropdown';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';
import { Input } from '@/components/ui/input';

const LiveSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  standard: z.string().min(1, 'Standard is required'),
  boardId: z.string().min(1, 'Board is required'),
  startDate: z.string().min(1, 'Start date is required'),
});

const StreamModal = ({ isOpen, onClose, refetch = () => {} }) => {
  const { standards, isLoading } = useSelector(
    (state: RootState) => state.standard
  );

  const { board, isLoading: boardLoading } = useSelector(
    (state: RootState) => state.board
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllStandards());
    dispatch(fetchAllboard());
  }, []);

  const form = useForm({
    resolver: zodResolver(LiveSchema),
    defaultValues: {
      title: '',
      standard: '',
      boardId: '',
      startDate: '', // Initialize with empty string, not undefined
    },
    mode: 'onChange', // Add this to make validation more responsive
  });

  const handleSubmit = async (data) => {
    console.log('Data submitted:', data);
    try {
      const response = await axios.post(
        ApiBaseurl + CREATE_UPCOMING_LIVE,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );
      refetch();
      onClose();
    } catch (error) {
      console.error('Error creating upcoming live:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Upcoming Live Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 p-10"
          >
            <div className="space-y-4">
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

              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value || ''} // Ensure value is never undefined
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        onItemSelect={(id) => {}}
                        value={field.value || ''} // Ensure value is never undefined
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
                        id: item._id,
                        label: item.boardname,
                      }))}
                      onItemSelect={(id) => {
                        console.log('Selected board ID:', id);
                      }}
                      value={field.value || ''} // Ensure value is never undefined
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StreamModal;
