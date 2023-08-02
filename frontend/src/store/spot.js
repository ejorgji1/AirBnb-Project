import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spots/spots'
const GET_SPOT_DETAILS= 'spots/spot'
const DELETE_SPOT = 'spots/delete'
const UPDATE_SPOT = 'spots/update'
const GET_USER_SPOTS='spots/currentUser'


const getAllSpotsAction = spots => ({
    type: GET_ALL_SPOTS,
    spots
})

const getSpotDetails = spot => ({
  type: GET_SPOT_DETAILS,
  spot
})

const deleteSpot = spotId => ({
  type: DELETE_SPOT,
  spotId
})

const getUserSpots = spots => ({
  type: GET_USER_SPOTS,
  spots
})

const updateSpot = spot => ({
  type: UPDATE_SPOT,
  spot
})

export const allSpotsThunk = () => async (dispatch) => {
      const res = await csrfFetch('/api/spots/');
      const spots = await res.json();
      //console.log( 'that is ', spots)
      if (res.ok) {
        dispatch(getAllSpotsAction(spots.Spots)); // Dispatching the action to update the state
        return spots;
      } else {
        const errorData = await res.json();
        return errorData;
      }
    } 

    export const spotDetailThunk = (spotId) => async (dispatch) => {
      const res = await csrfFetch(`/api/spots/${spotId}`)
      const spot = await res.json();
      if (res.ok) {
          dispatch(getSpotDetails(spot))
          return spot;
      } else {
          const errorData = await res.json()
          return errorData
      }
  }

  export const getUserSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current')
    const spots = await res.json();
    if (res.ok) {
        dispatch(getUserSpots(spots["Spots"]))
        return spots;
    } else {
        const errorData = await res.json()
        return errorData
    }
}
  
  export const createSpotThunk = (spot, owner, images) => async (dispatch) => {
    try {
        const res = await csrfFetch('/api/spots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spot)
        });

        if (!res.ok) throw new Error('Failed to create spot.');

        const newSpot = await res.json();

        if (Array.isArray(images)) {
            const spotImagesArray = [];

            for (const image of images) {
                image.spotId = newSpot.id;

                const imageData = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(image)
                });

                if (imageData.ok) {
                    const newImage = await imageData.json();
                    spotImagesArray.push(newImage);
                }
            }

            newSpot.SpotImages = spotImagesArray;
        } else if (images) {
            images.spotId = newSpot.id;

            const imageData = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(images)
            });

            if (imageData.ok) {
                const newImage = await imageData.json();
                newSpot.SpotImages = [newImage];
            }
        }

        newSpot.owner = owner;

        await dispatch(getSpotDetails(newSpot));
        return newSpot;
    } catch (err) {
        const error = await err.json();
        return error;
    }
};

export const deleteSpotThunk = (spotId) => async( dispatch) => {
  const res = await csrfFetch('/api/spots/${spotId}' , {
    method: 'DELETE'
  })

  if (res.ok ) { 
    dispatch(deleteSpot(spotId))
  } else {
    const errorData = await res.json()
    return errorData
  }
}

export const updateSpotThunk = (spot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spot.id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(spot)
  });
  const updatedSpot = await res.json()
  if (res.ok) {
      dispatch(updateSpot(updatedSpot))
      return updatedSpot
  } else {
      const errorData = await res.json()
      return errorData
  }
}


    export const spotReducer = (state =  {}, action) => {
        let newState;
        switch(action.type) {
            case GET_ALL_SPOTS:
                newState = {...state, allSpots: action.spots}
                return newState;
             case GET_SPOT_DETAILS:  
                newState = {...state, singleSpot: action.spot}
                return newState;
              case DELETE_SPOT:
                newState = {...state }  
                delete newState[action.spotId];
              case UPDATE_SPOT: 
              newState = {... state, singleSpot: action.spot}
              return newState;
             case GET_USER_SPOTS:
              newState = { ...state, allSpots: action.spot}
              return newState 
        default:
          return state
    }
  } 
    