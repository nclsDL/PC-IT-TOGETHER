import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md";
  showValue?: boolean;
}

export function StarRating({ rating, maxStars = 5, size = "sm", showValue = true }: StarRatingProps) {
  const sizeClass = size === "sm" ? "h-[15px] w-[15px]" : "h-5 w-5";

  return (
    <div className="flex items-center gap-[5px]">
      <div className="flex gap-[1px]">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;

          return (
            <Star
              key={i}
              className={`${sizeClass} ${
                filled
                  ? "text-[#FFC633] fill-[#FFC633]"
                  : partial
                  ? "text-[#FFC633] fill-[#FFC633]/50"
                  : "text-[#FFC633] fill-[#FFC633]/20"
              }`}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-black">
          {rating.toFixed(1)}<span className="text-black/60">/{maxStars}</span>
        </span>
      )}
    </div>
  );
}
