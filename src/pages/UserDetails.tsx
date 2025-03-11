import { CourseProgress } from "@/components/users/CourseProgress";
import { PaymentHistory } from "@/components/users/PaymentHistory";
import { QuizResults } from "@/components/users/QuizResults";
import { UserProfile } from "@/components/users/UserProfile";
import { useParams } from "react-router-dom";

export interface UserProfileProps {
    userId: string;
}

export const UserDetails = () => {

    const { id } = useParams<{ id: string }>();

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-8">
                <UserProfile userId={id}/>

                <div className="grid md:grid-cols-2 gap-8">
                    <CourseProgress userId={id}/>
                    <QuizResults userId={id}/>
                </div>

                <PaymentHistory userId={id}/>
            </div>
        </div>
    );
};