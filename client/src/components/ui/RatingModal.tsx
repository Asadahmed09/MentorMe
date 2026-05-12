import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import Modal from "./Modal";
import Button from "./Button";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (score: number, review: string) => void;
  isLoading?: boolean;
  mentorName?: string;
}

export default function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mentorName = "Mentor",
}: RatingModalProps) {
  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    if (score === 0) {
      alert("Please select a rating");
      return;
    }
    onSubmit(score, review);
    setScore(0);
    setReview("");
  };

  const handleClose = () => {
    setScore(0);
    setReview("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Rate ${mentorName}`}>
      <div className="space-y-6">
        {/* Star Rating */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Your Rating</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setScore(star)}
                onMouseEnter={() => setHoverScore(star)}
                onMouseLeave={() => setHoverScore(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <StarIcon
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverScore || score)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {score > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              You rated {score} out of 5 stars
            </p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Review (Optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this mentor..."
            maxLength={500}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {review.length}/500 characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            isLoading={isLoading}
            disabled={score === 0}
          >
            Submit Rating
          </Button>
        </div>
      </div>
    </Modal>
  );
}
