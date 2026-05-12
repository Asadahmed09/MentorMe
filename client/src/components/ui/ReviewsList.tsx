import { StarIcon } from "@heroicons/react/24/solid";

interface Review {
  id: number;
  score: number;
  review?: string;
  created_at: string;
  student_name?: string;
  student_image?: string;
}

interface ReviewsListProps {
  reviews: Review[];
  averageRating?: number;
  totalRatings?: number;
}

export default function ReviewsList({
  reviews,
  averageRating = 0,
  totalRatings = 0,
}: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <StarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      {averageRating > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </p>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">
                Based on {totalRatings}{" "}
                {totalRatings === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">
                  {review.student_name || "Anonymous"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.score
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            {review.review && (
              <p className="text-sm text-gray-700 leading-relaxed">
                {review.review}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
