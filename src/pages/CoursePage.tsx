import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import {
  fetchCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus,
} from '@/store/slices/course-slice';
import { CourseFormValues } from '@/lib/validations/course-schema';
import { Course } from '@/types/course';
import { CourseModal } from '@/components/course/CourseModal';
import { AppDispatch, RootState } from '@/store/store';
import { MyPagination } from '@/components/ui/my-pagination';
import { Input } from '@/components/ui/input';

export const CoursePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const { courses, isLoading, currentPage, totalPages } = useSelector(
    (state: RootState) => state.course
  );
  useEffect(() => {
    handlePageChange(1);
  }, [searchTerm]);

  const handleAddClick = () => {
    setSelectedCourse(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCourse(undefined);
  };

  const handleSubmit = (data: CourseFormValues) => {
    if (selectedCourse) {
      dispatch(updateCourse({ id: selectedCourse._id, courseData: data }))
        .then((res) => {
          if (res.type == 'courses/updateCourse/fulfilled') {
            toast({
              title: 'Success',
              description: 'Course updated successfully.',
            });
            handleModalClose();
          }
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: 'Failed to save course',
            variant: 'destructive',
          });
        });
    } else {
      dispatch(createCourse(data))
        .then((res) => {
          if (res.type == 'courses/addCourse/fulfilled') {
            toast({
              title: 'Success',
              description: 'Course added successfully',
            });
            handleModalClose();
          }
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: 'Failed to save course',
            variant: 'destructive',
          });
        });
    }
  };

  const handleToggleStatus = (course: Course) => {
    dispatch(toggleCourseStatus(course._id));
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchCourses({ page: page, search: searchTerm }));
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search courses by title"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Standard</TableHead>
              <TableHead>Price (₹)</TableHead>
              <TableHead>Refer Bonus</TableHead>
              <TableHead>Skill Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No courses found
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>
                    {course.subject ? course.subject.subject : '-'}
                  </TableCell>
                  <TableCell>
                    {course.standard ? course.standard.std : '-'}
                  </TableCell>
                  <TableCell>
                    {course.price === 0 ? 'Free' : `₹${course.price}`}
                  </TableCell>
                  <TableCell>{course?.bonusPercent}</TableCell>
                  <TableCell>{course.skillLevel}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        course.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(course)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(course)}
                    >
                      {course.isActive ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages >= 1 && (
        <MyPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <CourseModal
        open={isModalOpen}
        onClose={handleModalClose}
        course={selectedCourse}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
