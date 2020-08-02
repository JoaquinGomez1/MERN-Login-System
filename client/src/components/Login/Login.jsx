import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";
import validateData from "../../FormValidation";
import UserView from "../UserView/UserView";

export default function Login() {
  const [userData, setUserData] = useState([
    {
      username: "",
      password: "",
    },
  ]);

  const history = useHistory();
  const formRef = useRef();
  const errorMessageRef = useRef();

  // Update state
  const updateFields = (event) => {
    const name = event.target.name;
    const data = event.target.value;
    let prevData = [...userData];

    prevData[0][name] = data;

    setUserData(prevData);
  };

  // Validate data
  const validateAndSubmit = async (event) => {
    event.preventDefault();

    const verifiedData = validateData(userData[0]);
    const myData = userData[0];
    const myHeaders = new Headers({
      "Content-Type": "application/json",
    });

    // Send request to the server
    const req = await fetch("http://192.168.0.8:3001/login", {
      method: "POST",
      body: JSON.stringify({
        username: myData.username,
        password: myData.password,
      }),
      headers: myHeaders,
    });

    const data = await req.json();

    if (verifiedData.status && req.status <= 300) {
      localStorage.setItem("user", JSON.stringify(data));
      errorMessageRef.current.textContent = "";

      // Refresh component on succesfull login
      history.push("/login");
    } else {
      errorMessageRef.current.textContent = data.error;
    }
  };

  // Determine wich view needs to be rendered
  return localStorage.getItem("user") ? (
    <UserView></UserView>
  ) : (
    // --------------- Login Component ----------------
    <div className="login-component">
      <Link to="/">
        <button className="link goBack"> {"<"} </button>
      </Link>

      <div className="login-container">
        <form ref={formRef}>
          <input
            name="username"
            type="text"
            placeholder={"Username: "}
            onChange={updateFields}
          />
          <input
            name="password"
            type="password"
            placeholder={"Password: "}
            onChange={updateFields}
          />
          <p className="error-field" ref={errorMessageRef}></p>
          <button type="submit" onClick={validateAndSubmit}>
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
