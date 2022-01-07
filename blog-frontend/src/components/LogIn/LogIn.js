import React, { useState, useEffect } from "react";
import "./LogIn.css";
import axios from "axios";
import { Redirect } from "@reach/router";

function LogIn() {
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

  function postLogInRequest(e) {
    e.preventDefault();
    axios.defaults.withCredentials = true;  // needed to fix bug with axios
    axios
      .post("https://cloudpost-backend-auth.herokuapp.com/login", body, {withCredentials:true})
      .then((response) => {
        if (response.headers["content-type"].split(" ")[0].replace(";", "") === "text/html") {
            setResponse(response.data)
        }
        else {
            setResponse("successfully logged in")
        }
        
      })
      .catch((error) => {
        console.log(error);
        setResponse("error occurred")
      });
  }

  useEffect(() => {
    checkLoginStatus();
  }, [])

  return (
    <div className="LogIn">
      {!user.logged_in ? (
      <form className="LogInForm" onSubmit={(e) => postLogInRequest(e)}>
        <h2>Log In</h2>
        <input
          type="text"
          name="username"
          id="username"
          value={body.username}
          onChange={(e) => changeHandler(e)}
          placeholder="username"
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
        <div className="LogInActions">
          <a href="/">Home</a>
          <a href="/signup">Sign Up</a>
          <input type="submit" value="Log In" />
        </div>
        {response ? <p>{response}</p> : null}
      </form> ) : <Redirect to="/" />}
      {response === "successfully logged in" ? <Redirect to="/" /> : null}
    </div>
  );
}

export default LogIn;
