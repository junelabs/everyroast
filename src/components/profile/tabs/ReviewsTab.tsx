
import { useAuth } from "@/context/auth";
import ReviewsTabContent from "./reviews/ReviewsTabContent";

const ReviewsTab = () => {
  const { user } = useAuth();
  
  return <ReviewsTabContent userId={user?.id} />;
};

export default ReviewsTab;
