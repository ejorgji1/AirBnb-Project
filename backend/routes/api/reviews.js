const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage} = require('../../db/models');
const { Op } = require("sequelize")

const router = express.Router();




// Get all Reviews of the Current User

    // router.get("/current", requireAuth, async (req, res) => {
    //     const userId = req.user.id;
    //     const reviews = await Review.findAll({
    //       where: {
    //         userId: userId,
    //       },
    //       include: [
    //         { model: User, attributes: ["id", "firstName", "lastName"] },
    //         {
    //             model: Spot,
    //             // include: {
    //             //     model: SpotImage,
    //             //     attributes: ["url"] 
    //             // },
    //             attributes: {
    //               exclude: ["description", "createdAt", "updatedAt"],
    //             },
    //         },
    //         { model: ReviewImage, attributes: ["id", "url"] },
    //       ],
    //     });
      
    //     res.json({ Reviews: reviews });
    //   });

    router.get('/current', requireAuth, async (req, res) => {
        const userId = req.user.id;
        const currentUsersSpots = await Spot.findAll({
            where: { ownerId: userId }
        });
        const currentReviews = await Review.findAll({
            where: { userId: userId },
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName'] },
                { model: Spot, attributes: { exclude: ['description', 'createdAt', 'updatedAt'] } },
                { model: ReviewImage, attributes: ['id', 'url'] },
            ]
        });
        const results = [];

        for (let i = 0; i < currentReviews.length; i++) {
            let review = currentReviews[i];
            review = review.toJSON();

            // Preview Image for Spots
            for (let spot of currentUsersSpots) {
                spot = spot.toJSON();
                const previewImage = await SpotImage.findAll({
                    raw: true,
                    where: { preview: true, spotId: spot.id },
                    attributes: ['preview', 'url']
                });
                if (previewImage.length) review.Spot.previewImage = previewImage[0].url;
                if (!previewImage.length) review.Spot.previewImage = null;
            };

            results.push(review);
        }

        return res.json({ Reviews: results })
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
    } else {
        res.status(403).json({ message: "Forbidden" });
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
     } else {
        res.status(403).json({ message: "Forbidden" });
     }

  })
module.exports = router;