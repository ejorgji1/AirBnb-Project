import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spots/spots'

const getAllSpotsAction = spots => ({
    type: GET_ALL_SPOTS,
    spots
})


export const allSpotsThunk = () => async (dispatch) => {
      const res = await csrfFetch('/api/spots/');
      const spots = await res.json();
      //console.log( 'that is ', spots)
      if (res.ok) {
        dispatch(getAllSpotsAction(spots["Spots"])); // Dispatching the action to update the state
        return spots;
      } else {
        const errorData = await res.json();
        return errorData;
      }
    } 
  

    export const spotReducer = (state =  {}, action) => {
        let newState;
        switch(action.type) {
            case GET_ALL_SPOTS:
                newState = {...state, allSpots: action.spots}
                return newState;
            default:
                return state
        }
    }
        
    