import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showCount = false,
  count,
  interactive = false,
  onRatingChange,
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  // Create an array of the rating values to map over
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center">
      <div className="flex">
        {stars.map((value) => {
          // Determine if this star should be filled, half-filled, or empty
          const isFilled = value <= Math.floor(rating);
          const isHalfFilled = !isFilled && value <= Math.ceil(rating) && rating % 1 !== 0;
          
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleClick(value)}
              className={`${interactive ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
              aria-label={`Rate ${value} out of ${maxRating} stars`}
              disabled={!interactive}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? 'text-yellow-400 fill-yellow-400'
                    : isHalfFilled
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      
      {showCount && count !== undefined && (
        <span className="ml-1 text-sm text-gray-500">({count})</span>
      )}
    </div>
  );
};

export default StarRating;