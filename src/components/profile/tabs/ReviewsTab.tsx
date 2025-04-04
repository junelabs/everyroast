
import { useAuth } from "@/context/auth";
import ReviewsTabContent from "./reviews/ReviewsTabContent";

const ReviewsTab = () => {
  const { user } = useAuth();
  
  // Ensure we never pass undefined to ReviewsTabContent
  const safeUserId = user?.id || null;
  
  return <ReviewsTabContent userId={safeUserId} />;
};

export default ReviewsTab;
