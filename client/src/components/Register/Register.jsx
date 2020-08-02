import React, { useState, useRef, useLayoutEffect } from "react";
import "./Register.css";
import { Link, useHistory } from "react-router-dom";

const NoErrorFound = require("../../FormValidation");

export default function Register() {
  const [currentUser, setCurrentUser] = useState([
    {
      username: "",
      password: "",
      passwordConfirm: "",
      email: "",
      gender: "",
    },
  ]);
  const history = useHistory();

  const userInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();
  const emailInputRef = useRef();
  const formRef = useRef();

  const updateUserInfo = (event) => {
    let user = [...currentUser];
    const name = event.target.name;
    const data = event.target.value;

    user[0][name] = data;

    setCurrentUser(user);
  };

  const validateData = async (e) => {
    e.preventDefault();
    // Select every p and hide them by default
    const pTagsArray = document.querySelectorAll("p");
    pTagsArray.forEach((p) => {
      p.textContent = "";
      p.style.display = "none";
    });

    // Validate data
    const wasNoError = NoErrorFound(currentUser[0]);
    // Send Data to Backend
    if (wasNoError.status) {
      const registerData = await RegisterDataToDB();

      // Check for errors registering the user
      if (registerData.status !== 200) {
        const jsonRegisterData = await registerData.json();
        const errorField = document.querySelector(
          `.${jsonRegisterData.field}-error-message`
        );

        errorField.textContent = jsonRegisterData.error;
        errorField.style.display = "block";
      } else {
        await LogInUser();
        history.push("/login");
      }
    }
    // Display Error message
    else {
      const errorField = document.querySelector(
        `.${wasNoError.field}-error-message`
      );
      errorField.textContent = wasNoError.message;
      errorField.style.display = "block";
    }
  };

  // ---------- REGISTER USER TO DB ------------
  const RegisterDataToDB = async () => {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    const req = await fetch("http://localhost:3001/register", {
      method: "POST",
      body: JSON.stringify(currentUser[0]),
      headers: headers,
    });

    return req;
  };

  // ---------- LOG IN USER ------------
  const LogInUser = async () => {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    const req = await fetch("http://localhost:3001/login", {
      method: "POST",
      body: JSON.stringify(currentUser[0]),
      headers,
    });

    const data = await req.json();

    console.log(data);
    // Save data into localStorage;
    await localStorage.setItem("user", JSON.stringify(data));

    return req;
  };

  // Check whether the user is already loged In.
  // If so, redirect to login view before the component renders
  useLayoutEffect(() => {
    if (localStorage.getItem("user")) {
      history.push("/login");
    }
  }, []);

  // // ---------- RENDER COMPONENT ------------
  return (
    <div className="register-component">
      <Link to="/">
        <button className="link goBack">{" < "}</button>
      </Link>

      <div className="register-container">
        <form ref={formRef}>
          <div className="username-group group">
            <label
              onClick={() => {
                userInputRef.current.focus();
              }}
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              placeholder="JohnSmith123"
              name="username"
              onChange={updateUserInfo}
              ref={userInputRef}
            />
            <p className="username-error-message error-field">{}</p>
          </div>

          <div className="password-group group">
            <label
              htmlFor="password"
              onClick={() => {
                passwordInputRef.current.focus();
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Type your password here"
              name="password"
              onChange={updateUserInfo}
              ref={passwordInputRef}
            />
            <p className="password-error-message error-field">{}</p>

            <label
              htmlFor="password"
              onClick={() => {
                passwordConfirmInputRef.current.focus();
              }}
            >
              Confirm your password
            </label>
            <input
              type="password"
              placeholder="Type your password again"
              onChange={updateUserInfo}
              name="passwordConfirm"
              ref={passwordConfirmInputRef}
            />
            <p>{}</p>
          </div>

          <div className="email-group group">
            <label
              htmlFor="password"
              onClick={() => {
                emailInputRef.current.focus();
              }}
            >
              Email
            </label>
            <input
              type="text"
              placeholder="example@something.xyz"
              onChange={updateUserInfo}
              name="email"
              ref={emailInputRef}
            />
            <p className="email-error-message error-field">{}</p>
          </div>

          <div className="gender-group group">
            <label htmlFor="password">Gender</label>
            <select name="gender" id="gender" onChange={updateUserInfo}>
              <option value=""> - </option>
              <option value="male"> Male </option>
              <option value="female"> Female </option>
            </select>
            <p className="gender-error-message error-field">{}</p>
          </div>

          <div className="submit-group group">
            <p className="all-error-message error-field"></p>
            <input
              className="register-btn btn"
              type="submit"
              value="REGISTER"
              onClick={validateData}
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
}
