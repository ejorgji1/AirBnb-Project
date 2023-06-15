const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage} = require('../../db/models');
const { Op } = require("sequelize")

const router = express.Router();


//Delete a Review Image
router.delete('/:imageId', requireAuth, async ( req, res) => {
    const user = req.user.id;
    const imageId = req.params.imageId

    const image = await ReviewImage.findByPk(imageId);

    const spotImage = await ReviewImage.findOne({
        where : {id : imageId},
        include: [
            {model : Review,
            where: {userId : user}
        }
        ]
    })
    if (!spotImage) {
        return res.status(404).json({ message: "Review Image couldn't be found" });
      }
      await spotImage.destroy();
      res.json({message: "Successfully deleted"})
})



module.exports = router;