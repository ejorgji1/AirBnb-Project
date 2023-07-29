import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spots/spots'
const GET_SPOT_DETAILS= 'spots/spot'

const getAllSpotsAction = spots => ({
    type: GET_ALL_SPOTS,
    spots
})

const getSpotDetails = spot => ({
  type: GET_SPOT_DETAILS,
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
  

    export const spotReducer = (state =  {}, action) => {
        let newState;
        switch(action.type) {
            case GET_ALL_SPOTS:
                newState = {...state, allSpots: action.spots}
                return newState;
             case GET_SPOT_DETAILS:  
                newState = {...state, singleSpot: action.spot}
                return newState
        default:
          return state
    }
  } 
    