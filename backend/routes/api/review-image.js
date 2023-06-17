const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage} = require('../../db/models');
const { Op } = require("sequelize")

const router = express.Router();


//Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const reviewId = parseInt(req.params.imageId);
  
    const image = await ReviewImage.findByPk(reviewId)
    
    const reviewImage = await ReviewImage.findOne({
      where: { id: reviewId },
      include: [
        {
          model: Review,
          where: { userId: userId },
        },
      ],
    });
  
    if (!image) {
      return res.status(404).json({ message: "Review Image couldn't be found" });
    }
  
    if (!reviewImage) {
      return res.status(403).json({ message: "Forbidden" })
    }
  
    await reviewImage.destroy();
    res.json({ message: "Successfully deleted" });
  });


module.exports = router;