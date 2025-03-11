import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserProfileProps } from "@/pages/UserDetails.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store.ts";
import { fetchUserCourseTracking } from "@/store/slices/userdetails-slice.ts";
import { useEffect } from "react";
import { MyPagination } from "@/components/ui/my-pagination.tsx";

export const CourseProgress = ({ userId }: UserProfileProps) => {

    const { courseTracking, crCurrentPage, crTotalPage } = useSelector((state: RootState) => state.userDetail);

    const dispatch = useDispatch<AppDispatch>();

    const fetchCourseTracking = (page: number) => {
        dispatch(fetchUserCourseTracking({ page, userId }));
    };

    useEffect(() => {
        fetchCourseTracking(1);
    }, []);

    return (
        <Card className="pb-5">
            <CardHeader>
                <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {courseTracking.length == 0 ? (
                    <p className="text-center">No course progress found</p>
                ) : (
                    courseTracking.map((course) => (
                        <div key={course._id} className="space-y-2">
                            <div className="flex justify-between">
                                <p className="font-medium">{course.courseTitle}</p>
                                <p className="text-sm text-muted-foreground">
                                    {course.completionRate}%
                                </p>
                            </div>
                            <Progress value={course.completionRate} className="h-2"/>
                        </div>
                    ))
                )}
            </CardContent>

            {crTotalPage >= 1 && (
                <MyPagination
                    currentPage={crCurrentPage}
                    totalPages={crTotalPage}
                    onPageChange={fetchCourseTracking}
                />
            )}
        </Card>
    );
};
