import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { spotDetailThunk } from "../../store/spot";
//import { spotReviewsThunk } from "../../store/review";
import { useParams } from "react-router-dom";
import "./SpotDetails.css";

export default function SpotDetail() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user)
    const spot = useSelector((state) => state.spot.singleSpot)

   

    useEffect(() => {
        dispatch(spotDetailThunk(spotId))
    }, [dispatch, spotId]);

    //console.log('this is', spot?.spotImages.preview)

    const handleReserveClick = () => {
        alert("Feature coming soon")
    }

        if (!spot) {
            return <div>Loading...</div>;

        }
    return (
        <div className="spot-container">
          <div className="name">{spot.name}</div>
          <div className="location">
            {spot.city}, {spot.state}, {spot.country}
          </div>
          <div className="images-container">
            <div>
              <img
                className="preview-image"
                src={
                  spot?.spotImages && spot?.spotImages.find((image) => image.preview).url
                }
                alt="Preview Image of Spot"
              />
            </div>
            <div className="other-images">
              {spot.spotImages &&
                spot.spotImages
                  .filter((image) => !image.preview)
                  .map((image) => (
                    <img
                      className="other-image"
                      key={image.id}
                      src={image.url}
                      alt="Image of spot"
                    />
                  ))}
            </div>
          </div>
          <div className="belowImages">
            <div className="belowImages-info">
              <div className="hostInfo">
                Hosted by {spot.Owner && spot.Owner.firstName} {spot.Owner && spot.Owner.lastName}
              </div>
              <div className="description"> {spot.description}</div>
            </div>
            <div className="reserve-container">
              <div className="price-reviews">
                <div className="price">${spot.price} night</div>
                <div className={spot.numReviews === 0 ? "noReviews" : "reviews"}>
                  {spot.numReviews === 0 ? (
                    <div className="noReviews">
                      <i className="fa-solid fa-star"></i>
                      <div className="newListing">New</div>
                    </div>
                  ) : (
                    <div className="reviews">
                      <div className="starRating">
                        <i className="fa-solid fa-star"></i>
                        {spot.avgStarRating}
                      </div>
                      <div className="dot">·</div>
                      {spot.numReviews === 1 ? (
                        <div className="reviewCount">{spot.numReviews} review</div>
                      ) : (
                        <div className="reviewCount">{spot.numReviews} reviews</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button className="reserveButton" onClick={handleReserveClick}>
                Reserve Now
              </button>
            </div>
          </div>
          <div className="reviewsContainer">
            <div className={spot.numReviews === 0 ? "noReviews" : "mainReviews"}>
              {spot.numReviews === 0 ? (
                <div className="noReviewsContainer">
                  <div className="noReviews">
                    <i className="fa-solid fa-star"></i>
                    <div className="newListing">New</div>
                  </div>
                  {user && user.id !== spot.ownerId && (
                    <div className="beTheFirst">Be the first to post a review!</div>
                  )}
                </div>
              ) : (
                <div className="mainReviews">
                  <div className="starRating">
                    <i className="fa-solid fa-star"></i>
                    {spot.avgStarRating}
                  </div>
                  <div className="dot">·</div>
                  {spot.numReviews === 1 ? (
                    <div className="reviewCount">{spot.numReviews} review</div>
                  ) : (
                    <div className="reviewCount">{spot.numReviews} reviews</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )};