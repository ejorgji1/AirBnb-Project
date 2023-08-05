import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { spotDetailThunk } from "../../store/spot";
import { spotReviewsThunk } from "../../store/review";
import "./PostReviewModal.css";
import "./StarsRating"
import { createReviewThunk } from "../../store/review";
import StarsRating from "./StarsRating";

function PostReviewModal({ user, spot }) {
  const [errors, setErrors] = useState({});
  //   const [stars, setStars ] = useState(0);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [formDisabled, setFormDisabled] = useState(true);
//   const [disabled, setDisabled] = useState(false);
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const errors = {};
    if (stars && stars < 1) {
      errors.stars = "Please input a star rating";
    }
    if (comment && comment.length < 10) {
      errors.comment = "Comment needs a minimum of 10 characters";
    }
    setErrors(errors);
  }, [stars, comment]);

  useEffect(() => {
    if (!stars || !comment || stars < 1 || comment.length < 10) {
      setFormDisabled(true);
    } else {
      setFormDisabled(false);
    }
  }, [stars, comment]);

  const onChange = (stars) => {
    setStars(stars);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const submittedReview = { userId: user.id, review: comment, stars };

    return dispatch(createReviewThunk(spot.id, submittedReview))
      .then(() => {
        closeModal();
        dispatch(spotDetailThunk(spot.id));
        dispatch(spotReviewsThunk(spot.id));
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div id="postReviewContainer">
      <div className="postReviewHeading">How was your stay?</div>
      <label>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="comment-input"
          placeholder="Leave your review here..."
        />
      </label>
      {errors.comment && <p>{errors.comment}</p>}
      <div className="rating-input">
        <StarsRating disabled={false} stars={stars} onChange={onChange} />
        <div>Stars</div>
        {errors.rating && <p>{errors.rating}</p>}
      </div>
      <button
        onClick={handleSubmit}
        className={formDisabled ? "submit-button-inactive" : "submit-button"}
        type="submit"
        disabled={formDisabled}
      >
        Submit Your Review
      </button>
    </div>
  );
}

export default PostReviewModal;
