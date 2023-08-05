import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useModal } from "../../context/Modal";
import './DeleteSpotModal.css'
import { deleteSpotThunk } from "../../store/spot";
import { getUserSpotsThunk } from "../../store/spot";

function DeleteSpotModal ({spot}) {
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(deleteSpotThunk(spot.id))
        .then(() => {
          closeModal();
          dispatch(getUserSpotsThunk())
          history.push('/spots/current')
          })
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
              setErrors(data.errors);
            }
        }
          );
      };

    return (
        <div className="deleteSpotContainer">
            <div className="deleteHeader">Confirm Delete</div>
            <div className="deleteText">Are you sure you want to remove this spot from your listings?</div>
            <div>
                <button
                id="yesDelete"
                onClick={handleSubmit}
                >
                    Yes (Delete Spot)
                </button>
                <button
                id="noDelete"
                onClick={((e) => {
                  closeModal();
                  e.stopPropagation();
                  history.push('/spots/current')
                  })}
                >
                    No (Keep Spot)
                </button>
            </div>
        </div>
    )
}

export default DeleteSpotModal;