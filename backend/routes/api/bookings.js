const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, Reviewimage} = require('../../db/models');
const { Op } = require("sequelize")

const router = express.Router();

//Get all of the Current User's Bookings

// router.get('/current', requireAuth, async(req, res) => {
//     const user = req.user.id;
   
//          const bookings = await Booking.findAll({
//         where : {
//             userId : user
//         },include : [
//             {
//                 model : Spot,
//                 attributes : {
//                     include: ['id','ownerId','address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price' ]
//                 }
//             }
//         ]
//     })
//     res.json({ Bookings : bookings })
// })

router.get('/current',requireAuth, async (req, res) => {
        const results = [];
        const userId = req.user.id;
        const currentUserBookings = await Booking.findAll({
            where: { userId: userId },
            include: [
                { model: Spot, attributes: { exclude: ['spotId', 'description', 'createdAt', 'updatedAt'] } },
            ]
        });

        for (let i = 0; i < currentUserBookings.length; i++) {
            let booking = currentUserBookings[i];
            booking = booking.toJSON();

            
            for (let spot of currentUserBookings) {
                spot = spot.toJSON();
                const previewImage = await SpotImage.findAll({
                    raw: true,
                    where: { preview: true, spotId: spot.id },
                    attributes: ['preview']
                });
                if (previewImage.length) booking.Spot.previewImage = previewImage[0].url;
                if (!previewImage.length) booking.Spot.previewImage = '';
            };

            results.push(booking);
        };

        return res.json({ Bookings: results })
    })

// Delete a Booking

router.delete("/:bookingId", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const bookingId = req.params.bookingId;
    let booking = await Booking.findByPk(bookingId);
  
    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }
  
    const currentDate = new Date();
  
    if (userId === booking.userId) {
      let bookingStartDate = new Date(
        new Date(booking.dataValues.startDate).toUTCString()
      );
  
      if (bookingStartDate.getTime() < currentDate.getTime()) {
        return res
          .status(403)
          .json({ message: "Bookings that have been started can't be deleted" });
      }
      await booking.destroy();
      res.json({ message: "Successfully deleted" });
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  });


  //Edit a Booking
  router.put("/:bookingId", requireAuth, async (req, res) => {
    let { startDate, endDate } = req.body;
    const userId = req.user.id;
    const bookingId = parseInt(req.params.bookingId);
    let foundBooking = await Booking.findByPk(bookingId);
  
    if (!foundBooking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }
  
    startDate = new Date(new Date(startDate).toUTCString());
    endDate = new Date(new Date(endDate).toUTCString());
    const currentDate = new Date();
  
    if (endDate.getTime() <= startDate.getTime()) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { endDate: "endDate cannot be on or before startDate" },
      });
    }
    const currentBookings = await Booking.findAll({
      where: {
        spotId: foundBooking.spotId,
      },
    });
  
    for (let booking of currentBookings) {
      let bookingStartDate = new Date(
        new Date(booking.dataValues.startDate).toUTCString()
      );
      let bookingEndDate = new Date(
        new Date(booking.dataValues.endDate).toUTCString()
      );
      if (
        startDate.getTime() >= bookingStartDate.getTime() &&
        startDate.getTime() <= bookingEndDate.getTime()
      ) {
        return res.status(400).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: { startDate: "Start date conflicts with an existing booking" },
        });
      }
      if (
        endDate.getTime() >= bookingEndDate.getTime() &&
        endDate.getTime() <= bookingEndDate.getTime()
      ) {
        return res.status(400).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: { endDate: "End date conflicts with an existing booking" },
        });
      }
    }
  
    if (userId === foundBooking.userId) {
      let bookingEndDate = new Date(
        new Date(foundBooking.dataValues.endDate).toUTCString()
      );
  
      if (bookingEndDate.getTime() < currentDate.getTime()) {
        return res
          .status(403)
          .json({ message: "Past bookings can't be modified" });
      }
      foundBooking.startDate = startDate;
      foundBooking.endDate = endDate;
      await foundBooking.save();
      res.json(foundBooking);
    } else {
      res.status(403).json({ message: "Forbidden Access" });
    }
  });
  

module.exports = router;