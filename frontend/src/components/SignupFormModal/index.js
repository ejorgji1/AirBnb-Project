import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disabled, setDisabled] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  useEffect(() => {
    if (!email.length || !username.length || username.length < 4 || !firstName.length || !lastName.length || !password.length || password.length < 6 || !confirmPassword.length) {
      setDisabled(true)
    } else {
      setDisabled(false)}
  }, [email, username, firstName, lastName, password, confirmPassword])

  return (
    <>
      <form className="signUp-form-container" onSubmit={handleSubmit}>
      <h1 className="signUp">Sign Up</h1>
        <label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signUp-input"
            placeholder="Email"
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="signUp-input"
            placeholder="Username"
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label>

          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="signUp-input"
            placeholder="First Name"
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="signUp-input"
            placeholder="Last Name"
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signUp-input"
            placeholder="Password"
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="signUp-input"
            placeholder="Confirm Password"
          />
        </label>
        {errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}
        <button className={disabled ? "createUser-button-inactive" : "createUser-button"} type="submit" disabled={disabled}>Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;