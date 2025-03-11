// export const ApiBaseurl: string = `${import.meta.env.VITE_API_BASE_URL}/admin`;
// export const ApiBaseurl2: string = import.meta.env.VITE_API_BASE_URL;
// export const ApiBaseurl: string = `${import.meta.env.VITE_API_BASE_URL}/admin`;
export const ApiBaseurl: string = `http://13.201.191.41/api/v1/admin`;
// export const ApiBaseurl2: string = import.meta.env.VITE_API_BASE_URL;
export const ApiBaseurl2: string = "http://13.201.191.41/api/v1/admin";
//admin
export const AdminLoginUrl: string = "/login";

//Standard
export const standard_POST: string = "/standard/createstandard";
export const standard_GET_ID: string = "/standard/getstandard/:id";
export const standard_GET: string = "/standard/getallstandards";
export const standard_UPDATA: string = "/standard/updatestandard/:id";
export const standard_status_UPDATA: string = "/standard/standardtoggle";

//subject
export const subject_POST: string = "/subject/subjectcreate";
export const subject_GET_ID: string = "/subject/idsubject/:id";
export const subject_GET: string = "/subject/allsubjects";
export const subject_UPDATA: string = "/subject/updatesubject/:id";
export const subject_status_UPDATA: string = "/subject/togglesubject";

//board
export const board_POST: string = "/board/createboard";
export const board_GET_ID: string = "/board/getbyidboard/:id";
export const board_GET: string = "/board/allboard";
export const board_UPDATA: string = "/board/updateboard/:id";
export const board_status_UPDATA: string = "/board/toggleboard";

//activity
export const activity_POST: string = "/activity/createactivity";
export const activity_GET_ID: string = "/activity/idactivity/:id";
export const activity_GET: string = "/activity/allactivity";
export const activity_UPDATA: string = "/activity/updateactivity/:id";
export const activity_status_UPDATA: string = "/activity/toggleactivity";

//courses
export const createNewCourse: string = "/course/createcourse";
export const getCoursesByID: string = "/course/getbyidcourse";
export const getAllCourses: string = "/course/getallcourses";
export const coursesUpdate: string = "/course/updatecourse";
export const coursesStatusToggle: string = "/course/coursetoggle";

//quiz
export const createNewQuiz: string = "/quiz/create";
export const getQuizByID: string = "/quiz";
export const allQuiz: string = "/quiz/all";
export const quizUpdate: string = "/quiz/";
export const quizToggleStatus: string = "/quiz/activeToggle";
export const quizResult: string = "/quiz/results";

//lesson
export const createNewlesson: string = "/lesson/create";
export const getlessonByID: string = "/lesson/getbyidlesson";
export const alllesson: string = "/lesson/alllesson";
export const lessonUpdate: string = "/lesson/updatelesson";
export const lessonToggleStatus: string = "/lesson/togglelesson";

//mentor
export const createMentore: string = "/mentor/creatementors";
export const MentorListing: string = "/mentor/fetchmentors";
export const UpdateMentor: string = "/mentor/";
export const MentorToggleStatus: string = "/mentor/mentorstoggle";

// checkout / payment
export const checkout: string = "/getCheckoutDetails";
export const verifyPay: string = "/verifyPayment";

export const getAllUsers: string = "/user/all";
export const userToggleBlocks: string = "/user/toggleBlockUser";
export const updateUserDetails: string = "/user/updateUserDetails";

export const getAllPayment: string = "/payment/all";
export const getAllTransactions: string = "/payment/allTransactions";
export const getMyProfile: string = "/getProfile";
export const getUserQuizResults: string = "/quiz/getUserQuizResults";
export const getUserCourseTracking: string = "/course/getUserCoursesTrack";
export const getUserDetails: string = "/user/getUserDetails";

export const GET_OFFERS = "/offer";
export const POST_OFFER = "/offer";
export const GET_OFFER_DETAILS = (id: string) => `/offer/${id}`;
export const PUT_OFFER = (id: string) => `/offer/${id}`;
export const DELETE_OFFER = (id: string) => `/offer/${id}`;
export const GET_ELIGIBLE_QUIZZES = "/quiz/getEligibleOfrQuizzes";
export const GET_ELIGIBLE_COURSES = "/course/getEligibleOfrCourses";
