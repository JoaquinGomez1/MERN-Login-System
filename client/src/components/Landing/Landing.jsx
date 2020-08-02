import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <div className="container">
        <div className="links">
          <h1>Welcome</h1>
          <Link className="link" to="/register">
            <button className="register-btn landing-btn">
              <h3>Register</h3>
            </button>
          </Link>
          <Link className="link" to="/login">
            <button className="login-btn landing-btn ">
              <h3>Login</h3>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
