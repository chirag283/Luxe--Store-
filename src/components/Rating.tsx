/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showText?: boolean;
  reviewsCount?: number;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  maxStars = 5,
  size = 16,
  showText = false,
  reviewsCount,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const adjustFullStars = rating % 1 >= 0.75 ? fullStars + 1 : fullStars;

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rating: ${rating} out of ${maxStars} stars`}>
      <div className="flex items-center gap-0.5 text-amber-500">
        {[...Array(maxStars)].map((_, index) => {
          if (index < adjustFullStars) {
            return <Star key={index} size={size} fill="currentColor" className="stroke-amber-500" />;
          } else if (index === adjustFullStars && hasHalfStar) {
            return <StarHalf key={index} size={size} fill="currentColor" className="stroke-amber-500" />;
          } else {
            return <Star key={index} size={size} className="text-gray-300 dark:text-gray-600" />;
          }
        })}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewsCount !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
          ({reviewsCount} reviews)
        </span>
      )}
    </div>
  );
};
