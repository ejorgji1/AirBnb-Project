import { useState } from "react";

function StarsRating({ stars, disabled, onChange }) {
  const [activeStars, setActiveStars] = useState(stars);

  const handleStarHover = (starIndex) => {
    if (!disabled) setActiveStars(starIndex);
  };

  const handleStarClick = (starIndex) => {
    if (!disabled) onChange(starIndex);
  };

  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={activeStars >= index + 1 ? "filled" : "empty"}
          onMouseEnter={() => handleStarHover(index + 1)}
          onMouseLeave={() => handleStarHover(stars)}
          onClick={() => handleStarClick(index + 1)}
        >
          <i className="fa-solid fa-star"></i>
        </div>
      ))}
    </>
  );
}

export default StarsRating;