import { Star, StarHalf, StarOff } from 'lucide-react';

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
};

export function StarRating({ rating, maxRating = 5, size = 16, className }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" className="text-amber-500" style={{ width: size, height: size }} />
      ))}
      {halfStar && <StarHalf key="half" fill="currentColor" className="text-amber-500" style={{ width: size, height: size }} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} fill="none" className="text-amber-500" style={{ width: size, height: size }} />
      ))}
    </div>
  );
}
