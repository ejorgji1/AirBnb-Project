// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import logo from '../../Assets/Airbnb-logo.png'
import CreateSpot from "../CreateSpot";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className="logInContainer">
      <NavLink to='/spots/new' className="createSpot">Create a New Spot</NavLink>
      <div className="userProfile nav">
        <ProfileButton user={sessionUser} />
      </div>
      </div>
    );
  } else {
    sessionLinks = (
      <div className="navLinks">
        <OpenModalButton
        id="logInButton"
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
        id="signUpButton"
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </div>
    );
  }

  return (
    <div className="header">
        <NavLink exact to="/">
        <div className="logo">
        <img src={logo} alt="Airbnb logo" />
      </div>
        </NavLink>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;