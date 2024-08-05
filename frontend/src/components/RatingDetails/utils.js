export const calculateAverageRating = (ratings) => {
  const total = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.floor(total / ratings.length);
};

const categorizeRating = (rating) => {
  if (rating === 5) {
    return "Excellent";
  } else if (rating === 4) {
    return "Very Good";
  } else if (rating === 3) {
    return "Good";
  } else if (rating === 2) {
    return "Average";
  } else {
    return "Poor";
  }
};

export const countRatingsByCategory = (ratings, detailRatingCategory) => {
  ratings.forEach((rating) => {
    const category = categorizeRating(rating);

    detailRatingCategory.forEach((each) => {
      if (each.label.toLowerCase() === category.toLowerCase()) {
        each.raters++;
      }
    });
  });
};
