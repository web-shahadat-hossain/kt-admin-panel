export interface CourseTracking {
    _id: string;
    courseTitle: string;
    completionRate: number;
}

export interface CourseTrackingResponse {
    courseTracking: CourseTracking[];
    // totalPages: number;
    // currentPage: number;
}