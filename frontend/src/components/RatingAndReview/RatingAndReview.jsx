import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { Button, TextField, grid2Classes } from "@mui/material";
import { api } from "../../config/api";
import { useSelector } from "react-redux";

function RatingAndReview({ productID }) {
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");
  const [posting, setPosting] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);

  async function post() {
    setPosting(true);
    await api.post(`/api/user/rating/create`, {
      ratingValue: rating,
      productID,
    });
    await api.post(`/api/user/review/create`, {
      review,
      productID,
    });
    setPosting(false);
  }

  return (
    <div className="w-full grid grid-cols-5 gap-y-2">
      <div className="col-span-4 py-2 flex items-center">
        <Rating
          name="simple-controlled"
          sx={{ fontSize: 35 }}
          value={rating}
          onChange={(_, value) => setRating(value)}
        />
      </div>
      <div className="col-span-1  font-bold flex justify-center items-center">
        {rating}/5
      </div>
      <div className="col-span-5">
        <TextField
          id="outlined-multiline-flexible"
          label="Write a review"
          multiline
          sx={{ width: "100%" }}
          inputProps={{ style: { height: "100px" } }}
          maxRows={4}
          onChange={(event) => setReview(event.target.value)}
        />
      </div>
      <div className="col-span-5">
        <Button
          onClick={(e) => {
            if (!isLoggedIn) return;
            post();
          }}
          fullWidth
          sx={{
            bgcolor: "#4f46e5",
            color: "white",
            "&:hover": {
              bgcolor: "#463ed6", // Example hover background color
              color: "white",
            },
            "&.Mui-disabled": {
              color: "white", // Keep text color white when disabled
              opacity: 0.8,
            },
          }}
          disabled={!isLoggedIn ? true : false}
        >
          {!isLoggedIn && "Login to "}
          {posting ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}

export default RatingAndReview;
