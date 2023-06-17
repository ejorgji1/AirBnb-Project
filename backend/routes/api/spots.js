const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, ReviewImage} = require('../../db/models');
const { Op } = require("sequelize")

const router = express.Router();


const queryParamValidator = [
  check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  check("minLat")
    .optional()
    .isNumeric()
    .withMessage("Minimum latitude is invalid"),
  check("maxLat")
    .optional()
    .isNumeric()
    .withMessage("Maximum latitude is invalid"),
  check("minLng")
    .optional()
    .isNumeric()
    .withMessage("Minimum longitude is invalid"),
  check("maxLng")
    .optional()
    .isNumeric()
    .withMessage("Maximum longitude is invalid"),
  check("minPrice")
    .optional()
    .isNumeric({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isNumeric({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];

// Get all spots 

router.get('/', queryParamValidator, async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  let where = {};

  if (minLat) {
    where.lat = {
      [Op.gte]: minLat,
    };
  }

  if (maxLat) {
    where.lat = {
      [Op.lte]: maxLat,
    };
  }

  if (minLng) {
    where.lng = {
      [Op.gte]: minLng,
    };
  }

  if (maxLng) {
    where.lng = {
      [Op.lte]: maxLng,
    };
  }

  if (minPrice) {
    where.price = {
      [Op.gte]: minPrice,
    };
  }

  if (maxPrice) {
    where.price = {
      [Op.lte]: maxPrice,
    };
  }

  page = page === undefined ? 1 : parseInt(page);
  size = size === undefined ? 20 : parseInt(size);
  if (page > 10) page = 10;
  if (size > 20) size = 20;

  let limit, offset;
  if (page >= 1 && size >= 1) {
    limit = size;
    offset = (page - 1) * size;
  }


  const spots = await Spot.findAll({
  })

  const arraySpots = [];

  for (let spot of spots) {
    const reviews = await spot.getReviews();

    let sum = 0;
    for (let review of reviews) {
      sum += review.dataValues.stars;
    }
    let avg = sum / (reviews.length);
    spot.dataValues.avgRating = avg.toFixed(2);

    const previewImage = await SpotImage.findOne({
      where : {spotId: spot.id }
    })
   
    if (previewImage) {
      spot.dataValues.previewImage = previewImage.url;
    } else {
      spot.dataValues.previewImage = '';
    }

    arraySpots.push(spot.toJSON());
  }
  res.json({ Spots: arraySpots, page, size });

})

//Get all Spots owned by the Current User

router.get('/current', requireAuth, async ( req, res ) => {
  

  const userId = req.user.id 
 
  const spots = await Spot.findAll({
    where : {
      ownerId : userId
    }
  })

    const arraySpots = [];

    for (let spot of spots) {
    
      const reviews = await spot.getReviews();
  
      let sum = 0;
      for (let review of reviews) {
        sum += review.dataValues.stars;
      }
      let avg = sum / (reviews.length);
      spot.dataValues.avgRating = avg.toFixed(2);
  
      const previewImage = await SpotImage.findOne({
        where : {spotId: spot.id }
      })
     
      if (previewImage) {
        spot.dataValues.previewImage = previewImage.url;
      } else {
        spot.dataValues.previewImage = '';
      };
  
      arraySpots.push(spot.toJSON());
    }
    res.json({ Spots: arraySpots });
  })

  //Get details of a Spot from an id
  router.get("/:spotId", async (req, res) => {
    const spotId = parseInt(req.params.spotId);
    const spot = await Spot.findOne({
      where: { id: spotId },
      include: {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    });
  
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
  
    const reviews = await spot.getReviews();
  
    let sum = 0;
    let num = 0;
    for (let review of reviews) {
      sum += review.dataValues.stars;
      num++;
    }
    let avg = sum / (reviews.length);
    spot.dataValues.avgStarRating = avg.toFixed(2);
    spot.dataValues.numReviews = num;
  
    const spotImages = await SpotImage.findAll({
      where: { spotId: spot.id },
      attributes: {
        exclude: ["spotId", "createdAt", "updatedAt"],
      },
    });
  
    spot.dataValues.spotImages = spotImages;
  
    res.json(spot);
  });

  const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('address')
      .isAlphanumeric('en-US', {  ignore: ' '  })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('city')
      .isAlpha('en-US', {  ignore: ' '  })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('state')
      .isAlpha('en-US', {  ignore: ' '  })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('country')
      .isAlpha('en-US', {  ignore: ' '  })
      .withMessage('Country is required'),
    check('lat')
      .isDecimal({ decimal_digits: '0,15' })
      .withMessage('Latitude is not valid'),
    check('lng')
      .isDecimal({ decimal_digits: '0,15' })
      .withMessage('Longitude is not valid'),
    check('name')
      .exists({ checkFalsy: true })
      .withMessage('Name is required'),
    check('name')
      .isLength({  max: 50  })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .withMessage('Price per day is required'),
    check('price')
      .isInt({min: 0})
      .withMessage('Price must be a valid number'),
    handleValidationErrors
  ];


  // Create a Spot 

  router.post("/", validateSpot, requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } =
      req.body;
    const ownerId = req.user.id;
  
    const spot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });
  
    const spotData = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
    };

    return res.json(spotData);
  });

  //Add an Image to a Spot based on the Spot's id

  router.post("/:spotId/images", requireAuth, async (req, res) => {
    const { url, preview } = req.body;
    const userId = req.user.id;
    const spotId = req.params.spotId
    let spot = await Spot.findByPk(spotId);
  
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
  
    if (userId === spot.ownerId) {
      const image = await spot.createSpotImage({ spotId, url, preview });
      const newImage = {
        id: image.id,
        url: image.url,
        preview: image.preview,
      };
      res.json(newImage);
    } else {
      res.status(403).json({ message: "Forbidden" });
     }
  });

  // Edit a Spot
  router.put("/:spotId", validateSpot, requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } =
      req.body;
    const userId = req.user.id;
    const spotId = req.params.spotId;
    let spot = await Spot.findByPk(spotId);
  
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
  
    if (userId === spot.ownerId) {
      spot.address = address;
      spot.city = city;
      spot.state = state;
      spot.country = country;
      spot.lat = lat;
      spot.lng = lng;
      spot.name = name;
      spot.description = description;
      spot.price = price;
  
      await spot.save();
  
      res.json(spot);
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  });

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  const user = req.user.id;
  const spotId = req.params.spotId;
   

  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (user === spot.ownerId) {
    await spot.destroy();
    res.json({ message: "Successfully deleted" });
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
});


//Get all Reviews by a Spot's id

router.get("/:spotId/reviews", async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const reviews = await Review.findAll({
    where: {
      spotId: spotId,
    },
    include: [
      { model: User, 
        attributes: ["id", "firstName", "lastName"] },
      { model: ReviewImage, 
        attributes: ["reviewId", "url"] },
    ],
  });
  res.json({ Reviews: reviews });
});

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

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview ,async(req, res) => {
  const { review, stars } = req.body;
  const userId = req.user.id;
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const existing = await Review.findOne({ where: { userId, spotId } });

  if (existing) {
    return res.status(500).json({ message: "User already has a review for this spot" });
  }

  const newReview = await Review.create({
    userId,
    spotId,
    review,
    stars,
  });
  const safeReview = {
    id: newReview.id,
    userId: newReview.userId,
    spotId: newReview.spotId,
    review: newReview.review,
    stars: newReview.stars,
    createdAt: newReview.createdAt,
    updatedAt: newReview.updatedAt,
  };
  return res.json(safeReview);

})

//Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const spotId = req.params.spotId
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (userId !== spot.ownerId) {
    const bookings = await Booking.findAll({
      where: {
        spotId: spotId,
      },
      attributes: ["spotId", "startDate", "endDate"],
    });
    res.json({ Bookings: bookings });
  } else {
    const bookings = await Booking.findAll({
      where: {
        spotId: spotId,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });
    res.json({ Bookings: bookings });
  }
});

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async ( req, res) => {
  let { startDate, endDate } = req.body;

  startDate = new Date(new Date(startDate).toUTCString());
  endDate = new Date(new Date(endDate).toUTCString());

  if (endDate.getTime() <= startDate.getTime()) {
    return res.status(400).json({
      message: "Bad Request",
      errors: { endDate: "endDate cannot be on or before startDate" },
    });
  }
  const userId = req.user.id;
  const spotId = parseInt(req.params.spotId);
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const currentBookings = await Booking.findAll({
    where: {
      spotId: spot.id,
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

  if (userId !== spot.ownerId) {
    const newBooking = await Booking.create({
      userId,
      spotId,
      startDate,
      endDate,
    });
    const safeBooking = {
      id: newBooking.id,
      userId: newBooking.userId,
      spotId: newBooking.spotId,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
      createdAt: newBooking.createdAt,
      updatedAt: newBooking.updatedAt,
    };
    return res.json(safeBooking);
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
});


//Edit a spot
router.put("/:spotId", validateSpot, requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const userId = req.user.id;
  const spotId = parseInt(req.params.spotId);
  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (userId === spot.ownerId) {
    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    await spot.save();

    res.json(spot);
  } else {
    res.status(403).json({ message: "Unauthorized access" });
  }
});

//Add an image to a spot based on the spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const userId = req.user.id;
  const spotId = parseInt(req.params.spotId);
  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (userId === spot.ownerId) {
    const image = await spot.createSpotImage({ spotId, url, preview });
    const newImage = {
      id: image.id,
      url: image.url,
      preview: image.preview,
    };
    res.json(newImage);
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
});

module.exports = router;