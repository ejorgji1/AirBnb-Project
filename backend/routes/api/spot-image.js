const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, Reviewimage} = require('../../db/models');
const { Op } = require("sequelize")

const router = express.Router();

//Delete Spot Image
router.delete('/:imageId', requireAuth, async(req, res) => {
    const user = req.user.id
    const imageId = req.params.imageId

    const image = await SpotImage.findByPk(imageId);

    const spotImage = await SpotImage.findOne({
        where : {spotId : imageId},
        include: [
            {model : Spot,
            where: {ownerId : user}
        }
        ]
    })
    if (!spotImage) {
        return res.status(404).json({ message: "Spot Image couldn't be found" });
      }
      await spotImage.destroy();
      res.json({message: "Successfully deleted"})

})



module.exports = router;