import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom'
import { createSpotThunk } from '../../store/spot'
import './CreateSpot.css'

export default function CreateSpot() {
    const history = useHistory();
    const dispatch = useDispatch();
    const owner = useSelector(state => state.session.user)

    const [country, setCountry] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [description, setDescription] = useState("")
    const [latitude, setLatitude] = useState(40)
    const [longitude, setLongitude] = useState(40)
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const [imagePreview, setImagePreview] = useState("")
    const [image1, setImage1] = useState("")
    const [image2, setImage2] = useState("")
    const [image3, setImage3] = useState("")
    const [image4, setImage4] = useState("")
    const [validationErrors, setValidationErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)

    const urlValidation = str => {
        return /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/.test(str);
    }

    useEffect(() => {
        const errorsObject = {};
        if (!country) {
            errorsObject.country = "Country is required"
        }
        if (!address) {
            errorsObject.address = "Address is required"
        }
        if (!city) {
            errorsObject.city = "City is required"
        }
        if (!state) {
            errorsObject.state = "State is required"
        }
        if (!latitude) {
            errorsObject.latitude = "Latitude is required"
        }

        if (!longitude) {
            errorsObject.longitude = "Longitude is required"
        }
        if (isNaN(latitude)) {
            errorsObject.latitude = "latitude must be a number";
        }

        if (isNaN(longitude)) {
            errorsObject.longitude = "longitude must be a number";
        }

        if (description.length < 30) {
            errorsObject.description = "Description needs a minimum of 30 characters"
        }
        if (description.length < 30) {
            errorsObject.description = "Description needs a minimum of 30 characters"
        }
        if (!title) {
            errorsObject.title = "Name is required"
        }
        if (title.length > 50) {
            errorsObject.title = "Name must be less than 50 characters"
        }
        if (!price) {
            errorsObject.price = "Price is required"
        }
        if (isNaN(price)) {
            errorsObject.price = "Price must be a number";
        }
        if (!imagePreview) {
            errorsObject.imagePreview = "Preview image is required."
        }
        if (imagePreview && !imagePreview.match(/(\.png|\.jpg|\.jpeg)\s*$/)) {
            errorsObject.imagePreview = "iImage URL must end in .png, .jpg, or .jpeg.";
        }
        if (image1 && !image1.match(/(\.png|\.jpg|\.jpeg)\s*$/)) {
            errorsObject.image1 = "Image URL must end in .png, .jpg, or .jpeg.";
        }
        if (image2 && !image2.match(/(\.png|\.jpg|\.jpeg)\s*$/)) {
            errorsObject.image2 = "Image URL must end in .png, .jpg, or .jpeg.";
        }
        if (image3 && !image3.match(/(\.png|\.jpg|\.jpeg)\s*$/)) {
            errorsObject.image3 = "Image URL must end in .png, .jpg, or .jpeg.";
        }
        if (image4 && !image4.match(/(\.png|\.jpg|\.jpeg)\s*$/)) {
            errorsObject.image4 = "Image URL must end in .png, .jpg, or .jpeg.";
        }
        setValidationErrors(errorsObject)
    }, [country, address, city, state, description, title, price, latitude, longitude, imagePreview, image1, image2, image3, image4])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true)

        if (Object.values(validationErrors).length) {
            return (
                alert("Form data is invalid, please correct your submission.")
            )
        }
        setValidationErrors({})

        
        const spot = {address, city, state, country, lat: latitude, lng: longitude, name: title, description, price}

        const imageArray = []

        if (imagePreview) {
            const imagePreviewObj = {
                url: imagePreview,
                preview: true
            }
            imageArray.push(imagePreviewObj)
        }
        if (image1) {
            const image1Obj = {
                url: image1,
                preview: false
            }
            imageArray.push(image1Obj)
        }
        if (image2) {
            const image2Obj = {
                url: image2,
                preview: false
            }
            imageArray.push(image2Obj)
        }
        if (image3) {
            const image3Obj = {
                url: image3,
                preview: false
            }
            imageArray.push(image3Obj)
        }
        if (image4) {
            const image4Obj = {
                url: image4,
                preview: false
            }
            imageArray.push(image4Obj)
        }
// console.log( 'this is' , imagePreview);
// console.log(image1);
// console.log(image2);
// console.log(image3);
// console.log(image4);

        const newSpot = await dispatch(createSpotThunk(spot, owner, imageArray));
        // console.log(newSpot)

        setCity('');
        setCountry('');
        setAddress('');
        setState('');
        setDescription('');
        setTitle('');
        setLatitude(40);
        setLongitude(40);
        setPrice('');
        setImagePreview('');
        setImage1('');
        setImage2('');
        setImage3('');
        setImage4('');


        newSpot && history.push(`/spots/${newSpot.id}`)

    }
    
    return (
        <div className="createSpotContainer">
            <form onSubmit={handleSubmit}>
                <div className="createSpotHeading">Create a New Spot</div>
                <div className="locationInfo">
                    <div className="locationHeader">Where's your place located?</div>
                    <div className="locationText">Guests will only get your exact address once they booked a reservation.</div>
                <div className="inputContainer">Country
                    <input 
                    value={country}
                    type="text"
                    placeholder="Country"
                    onChange={(e) => setCountry(e.target.value)}/>
                    {submitted && validationErrors.country && <p className="error">{validationErrors.country}</p>}
                </div>
                <div className="inputContainer">Address
                    <input 
                    value={address}
                    type="text"
                    placeholder="Address"
                    onChange={(e) => setAddress(e.target.value)}/>
                    {submitted && validationErrors.address && <p className="error">{validationErrors.address}</p>}
                </div>
                <div className="cityStateContainer">
                    <div className="inputContainer">City
                    <input 
                    value={city}
                    type="text"
                    placeholder="City"
                    onChange={(e) => setCity(e.target.value)}/>
                    {submitted && validationErrors.city && <p className="error">{validationErrors.city}</p>}
                    </div>
                    <div className="inputContainer">State
                    <input 
                    value={state}
                    type="text"
                    placeholder="State"
                    onChange={(e) => setState(e.target.value)}/>
                    {submitted && validationErrors.state && <p className="error">{validationErrors.state}</p>}
                    </div>
                </div>
                <div className="latLongContainer">
                <div className="inputContainer">Latitude
                    <input 
                    value={latitude}
                    type="number"
                    placeholder="Latitude"
                    onChange={(e) => setLatitude(e.target.value)}/>
                    {submitted && validationErrors.latitude && <p className="error">{validationErrors.latitude}</p>}
                </div>
                <div className="inputContainer">Longitude
                    <input 
                    value={longitude}
                    type="number"
                    placeholder="Longitude"
                    onChange={(e) => setLatitude(e.target.value)}/>
                    {submitted && validationErrors.longitude && <p className="error">{validationErrors.longitude}</p>}
                </div>
                </div>
                </div>
            <div className="descriptionInfo">
                <div className="descriptionHeader">Describe your place to guests</div>
                <div className="descriptionText">Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</div>
                <div className="inputContainer">
                    <input 
                    value={description}
                    type="text"
                    placeholder="Please write at least 30 characters."
                    onChange={(e) => setDescription(e.target.value)}/>
                    {submitted && validationErrors.description && <p className="error">{validationErrors.description}</p>}
                </div>
            </div>
            <div className="titleInfo">
                <div className='titleHeader'>Create a title for your spot</div>
                <div className='titleText'>Catch guests' attention with a spot title that highlights what makes your place special.</div>
                <div className="inputContainer">
                    <input 
                    value={title}
                    type="text"
                    placeholder="Name of your spot"
                    onChange={(e) => setTitle(e.target.value)}/>
                    {submitted && validationErrors.title && <p className="error">{validationErrors.title}</p>}
                </div>
            </div>
            <div className="priceInfo">
                <div className="priceHeader">Set a base price for your spot</div>
                <div className="priceText">Competitive pricing can help our listing stand out and rank higher in search results.</div>
                <div className="inputContainer priceContainer">$
                    <input 
                    value={price}
                    type="number"
                    placeholder="Price per night (USD)"
                    onChange={(e) => setPrice(e.target.value)}/>
                </div>
                    {submitted && validationErrors.price && <p className="error">{validationErrors.price}</p>}
            </div>
            <div className="imagesInfo">
                <div className="imagesHeader">Liven up your spot with photos</div>
                <div className="imagesText">Submit a link to at least one photo to publish your spot.</div>
                <div className="inputContainer">
                    <input 
                    value={imagePreview}
                    type="text"
                    placeholder="Preview Image URL"
                    onChange={(e) => setImagePreview(e.target.value)}/>
                    {submitted && validationErrors.imagePreview && <p className="error">{validationErrors.imagePreview}</p>}
                </div>
                <div className="inputContainer">
                    <input 
                    value={image1}
                    type="text"
                    placeholder="Image URL"
                    onChange={(e) => setImage1(e.target.value)}/>
                    {submitted && validationErrors.image1 && <p className="error">{validationErrors.image1}</p>}
                </div>
                <div className="inputContainer">
                    <input 
                    value={image2}
                    type="text"
                    placeholder="Image URL"
                    onChange={(e) => setImage2(e.target.value)}/>
                    {submitted && validationErrors.image2 && <p className="error">{validationErrors.image2}</p>}
                </div>
                <div className="inputContainer">
                    <input 
                    value={image3}
                    type="text"
                    placeholder="Image URL"
                    onChange={(e) => setImage3(e.target.value)}/>
                    {submitted && validationErrors.image3 && <p className="error">{validationErrors.image3}</p>}
                </div>
                <div className="inputContainer">
                    <input 
                    value={image4}
                    type="text"
                    placeholder="Image URL"
                    onChange={(e) => setImage4(e.target.value)}/>
                    {submitted && validationErrors.image4 && <p className="error">{validationErrors.image4}</p>}
                </div>
            </div>
            <div className="submitContainer">
            <button type='submit' className="submit-button">Create Spot</button>
            </div>
            </form>
        </div>
    )
}