import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./UserView.css";

export default function UserView() {
  // If this component is rendered means that the user is currently loged in.
  const localData = localStorage.getItem("user");
  const [userData, setUserData] = useState(JSON.parse(localData));
  const history = useHistory();

  function logOut() {
    localStorage.removeItem("user");
    setUserData({});
  }

  // Redirect if user has log out
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      history.push("/login");
    }
  }, [userData]);

  return (
    <div className="UserView-component">
      <h1>Welcome {userData.username}</h1>
      <h3>
        Logged in at:{" "}
        <span style={{ fontSize: "14px" }}>{userData.loginTime}</span>
      </h3>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
}
