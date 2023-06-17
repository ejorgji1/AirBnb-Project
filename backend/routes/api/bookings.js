const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, Reviewimage} = require('../../db/models');
const { Op } = require("sequelize")

const router = express.Router();

//Get all of the Current User's Bookings

router.get('/current', requireAuth, async(req, res) => {
    const user = req.user.id;
   
         const bookings = await Booking.findAll({
        where : {
            userId : user
        },include : [
            {
                model : Spot,
                attributes : {
                    include: ['id','ownerId','address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price' ]
                }
            }
        ]
    })
    res.json({ Bookings : bookings })
})




module.exports = router;