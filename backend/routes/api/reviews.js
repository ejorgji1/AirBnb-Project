const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage} = require('../../db/models');
const { Op } = require("sequelize")

const router = express.Router();


// Get all Reviews of the Current User

    router.get("/current", requireAuth, async (req, res) => {
        const userId = req.user.id;
        const reviews = await Review.findAll({
          where: {
            userId: userId,
          },
          include: [
            { model: User, attributes: ["id", "firstName", "lastName"] },
            { model: ReviewImage, attributes: ["id", "url"] },
          ],
        });
      
        res.json({ Reviews: reviews });
      });



//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body;
    const userId = req.user.id;
    const reviewId = parseInt(req.params.reviewId)
    const review = await Review.findByPk(reviewId)

    if (!review) {
        return res.status(404).json({message: "Review couldn't be found"})
    }

    //add error handling: cannot add any more images because there is a maximum of 10 images per source
    const existingImagesCount = await review.countReviewImages();

    if (existingImagesCount >= 10) {
        return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
    }

    if (userId === review.userId) {
        const image = await review.createReviewImage({ reviewId, url})
        const newImage = {
            id: image.id,
            url: image.url
        }
        res.json(newImage)
    } else {
        res.status(403).json({ message: "Forbidden" });
    }
})

const validateReview = [
    check("review")
      .exists({ checkFalsy: true })
      .withMessage("Review text is required"),
    check("stars")
      .exists({ checkFalsy: true })
      .isInt({ min: 1, max: 5 })
      .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors,
  ];

  //Edit a Review

  router.put('/:reviewId', validateReview, requireAuth, async (req, res) => {
    const { review, stars } = req.body;
    const userId = req.user.id;
    const reviewId = (req.params.reviewId)
    let existingRev = await Review.findByPk(reviewId)

    if (!existingRev) {
        return res.status(404).json({message: "Review couldn't be found"})
    }

    if (userId === existingRev.userId) {
        existingRev.review = review;
        existingRev.stars = stars;
        await existingRev.save();
        res.json(existingRev);
    }
  })


  //Delete a Review

  router.delete('/:reviewId', requireAuth, async (req, res) => {
    const userId = req.user.id
     const reviewId = req.params.reviewId
     let review = await Review.findByPk(reviewId)

     if(!review) {
        return res.status(404).json({message: "Review couldn't be found"})
     }

     if( userId === review.userId) {
        await review.destroy();
        res.json({message : "Successfully deleted"})
     }

  })
module.exports = router;