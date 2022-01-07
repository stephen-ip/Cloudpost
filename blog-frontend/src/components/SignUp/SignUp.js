import React, { useState, useEffect } from "react";
import "./SignUp.css";
import axios from "axios";
import { Redirect } from "@reach/router";

function SignUp() {
  const [user, setUser] = useState({
    logged_in: false,
    username: "",
    email: ""
  });
  const [body, setBody] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [response, setResponse] = useState("");

  function checkLoginStatus() {
    axios
      .get("https://cloudpost-backend-auth.herokuapp.com/logged_in", { withCredentials: true })
      .then((response) => {
        setUser({
          logged_in: response.data.logged_in,
          username: response.data.username,
          email:response.data.email
        })
      })
      .catch((error) => {
        setUser({
          logged_in: false,
          username: "",
          email: ""
        })
      });
  }

  function changeHandler(e) {
    const newBody = { ...body };
    newBody[e.target.id] = e.target.value;
    setBody(newBody);
  }

  function postSignUpRequest(e) {
    e.preventDefault();
    axios
      .post("https://cloudpost-backend-auth.herokuapp.com/signup", body)
      .then((response) => {
        console.log(response.data);
        setResponse(response.data);
      })
      .catch((error) => {
        console.log(error);
        setResponse(error.response.data);
      });
  }

  useEffect(() => {
    checkLoginStatus();
  }, [])

  return (
    <div className="SignUp">
      {!user.logged_in ? (
      <form className="SignUpForm" onSubmit={(e) => postSignUpRequest(e)}>
        <h2>Sign Up</h2>
        <input
          type="text"
          name="username"
          id="username"
          value={body.username}
          onChange={(e) => changeHandler(e)}
          placeholder="username"
          required
          minlength="3"
          maxlength = "20"
        ></input>
        <input
          type="email"
          name="email"
          id="email"
          value={body.email}
          onChange={(e) => changeHandler(e)}
          placeholder="email"
          required
        ></input>
        <input
          type="password"
          name="password"
          id="password"
          value={body.password}
          onChange={(e) => changeHandler(e)}
          placeholder="password"
          required
        ></input>
        <input
          type="password"
          name="passwordConfirm"
          id="passwordConfirm"
          value={body.passwordConfirm}
          onChange={(e) => changeHandler(e)}
          placeholder="confirm password"
          required
        ></input>
        <div className="SignUpActions">
          <a href="/">Home</a>
          <a href="/login">Log In</a>
          <input type="submit" value="Sign Up" />
        </div>
        {response ? <p>{response}</p> : null}
      </form> ) : <Redirect to="/" />}
      {response === "Successfully created account" ? <Redirect to="/login" /> : null}
    </div>
  );
}

export default SignUp;
