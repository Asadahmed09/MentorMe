import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { cn } from "../../utils/helpers";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, index) => {
        const value = index + 1;
        const isFilled = value <= rating;
        // const isHalf = value > rating && value - 0.5 <= rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(value)}
            className={cn(
              "focus:outline-none",
              interactive &&
                "cursor-pointer hover:scale-110 transition-transform",
            )}
            disabled={!interactive}
          >
            {isFilled ? (
              <StarIcon className={cn(sizeClasses[size], "text-yellow-400")} />
            ) : (
              <StarOutlineIcon
                className={cn(sizeClasses[size], "text-gray-300")}
              />
            )}
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
