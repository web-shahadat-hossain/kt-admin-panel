import { Calendar, Music, School, Target, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfileProps } from "@/pages/UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store.ts";
import { useEffect } from "react";
import { fetchUserDetails } from "@/store/slices/userdetails-slice.ts";


export const UserProfile = ({ userId }: UserProfileProps) => {

    const { user } = useSelector((state: RootState) => state.userDetail);

    const dispatch = useDispatch<AppDispatch>();

    const fetchUser = () => {
        dispatch(fetchUserDetails(userId));
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-500"/>
                </div>
                <div className="flex-1">
                    <CardTitle>{user?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <p className="text-sm text-muted-foreground">{user?.mobile}</p>
                </div>
                <div className="text-sm text-muted-foreground text-right">
                    <p>Last
                        Login: {new Date(user?.lastLoginAt).toLocaleDateString()} {new Date(user?.lastLoginAt).toLocaleTimeString()}</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Calendar className="h-4 w-4"/>
                            Basic Information
                        </h3>
                        <div className="space-y-2">
                            <p className="text-sm">
                                <span className="text-muted-foreground">Date of Birth:</span>{" "}
                                {new Date(user?.dob).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                                <span className="text-muted-foreground">Standard:</span> {user?.stdId?.std ?? ""}
                            </p>
                            <p className="text-sm">
                                <span
                                    className="text-muted-foreground">Board:</span> {user?.boardId?.boardshortname ?? ""}
                            </p>
                        </div>
                    </div>

                    {/* Academic Details */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <School className="h-4 w-4"/>
                            Academic Details
                        </h3>
                        <div className="space-y-2">
                            <p className="text-sm">
                                <span className="text-muted-foreground">School:</span> {user?.schoolName}
                            </p>
                            <div className="text-sm">
                                <span className="text-muted-foreground">Subjects:</span>{" "}
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {user?.subject.map(subject => (
                                        <span key={subject._id}
                                              className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                            {subject.subject}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Extra Activities */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Music className="h-4 w-4"/>
                            Extra Activities
                        </h3>
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                                {user?.activity.map(activity => (
                                    <span key={activity._id}
                                          className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                                    {activity.activityname}
                                  </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Learning Stats */}
                    <div className="space-y-3 md:col-span-2 lg:col-span-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Target className="h-4 w-4"/>
                            Learning Progress
                        </h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="space-y-1">
                                <p className="text-2xl font-bold">{user?.totalCourses ?? 0}</p>
                                <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold">{user?.completedQuizzes ?? 0}</p>
                                <p className="text-sm text-muted-foreground">Completed Quizzes</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold">{new Date(user?.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm text-muted-foreground">Member Since</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
