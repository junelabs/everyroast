
import ReviewsTabContent from "./reviews/ReviewsTabContent";

interface ReviewsTabProps {
  defaultTab?: boolean;
}

const ReviewsTab = ({ defaultTab = false }: ReviewsTabProps) => {
  return <ReviewsTabContent defaultTab={defaultTab} />;
};

export default ReviewsTab;
