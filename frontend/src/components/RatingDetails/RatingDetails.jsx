import React from "react";
import Rating from "@mui/material/Rating";
import LinearProgress from "@mui/material/LinearProgress";
import { calculateAverageRating, countRatingsByCategory } from "./utils";
import { useSelector } from "react-redux";

export default function RatingDetails({ allUserRatings }) {
  const detailRatingCategory = [
    { label: "Excellent", color: "#1B4228", raters: 0 },
    { label: "Very good", color: "#66FF99", raters: 0 },
    { label: "Good", color: "yellow", raters: 0 },
    { label: "Average", color: "#42281B", raters: 0 },
    { label: "Poor", color: "red", raters: 0 },
  ];

  const totalNoOfRaters = allUserRatings.length;
  const avgRating = calculateAverageRating(allUserRatings);
  countRatingsByCategory(allUserRatings, detailRatingCategory);
  const { isLoggedIn } = useSelector((state) => state.auth);

  return totalNoOfRaters != 0 ? (
    <div className="p-5">
      <div className="flex justify-start gap-x-5">
        <Rating name="read-only" readOnly value={avgRating} />
        Based on {totalNoOfRaters} {totalNoOfRaters > 1 ? "users" : "user"} data
      </div>
      <div className="mt-2">
        {detailRatingCategory.map((item, ind) => {
          return (
            <div key={ind} className="mt-2">
              <p className="mb-2">
                {item.label}
                {/* {detailRating[ind]} */}
              </p>
              <LinearProgress
                variant="determinate"
                value={
                  (detailRatingCategory[ind].raters /
                    (totalNoOfRaters == 0 ? 1 : totalNoOfRaters)) *
                  100
                }
                sx={{
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: item.color, // Set the color of the progress bar
                  },
                  height: 8,
                  borderRadius: 10,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="mb-4">No rating and review is available</div>
  );
}
