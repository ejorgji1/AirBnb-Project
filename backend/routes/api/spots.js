const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Booking, Review, Reviewimage} = require('../../db/models');
const { Op } = require("sequelize")

const router = express.Router();


// Get all spots 

router.get('/', async (req, res) => {
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
      where : {spotID: spot.id}
    })
   
    spot.dataValues.previewImage = previewImage.url 

    arraySpots.push(spot.toJSON());
  }
  res.json({ Spots: arraySpots });

})

//Get all Spots owned by the Current User

router.get('/current', requireAuth, async ( req, res ) => {
  console.log(req.user)

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
        where : {spotID: spot.id}
      })
     
      spot.dataValues.previewImage = previewImage.url 
  
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





module.exports = router;