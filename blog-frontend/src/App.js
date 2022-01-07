import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Router } from "@reach/router";
import Posts from "./components/Posts";
import Post from "./components/Post";
import SignUp from "./components/SignUp/SignUp";
import LogIn from "./components/LogIn/LogIn";
import MyPosts from "./components/MyPosts/MyPosts";

function App() {
  return (
    <div className="App">
      <Router>
        <Posts path="/" />
        <Post path="/post" />
        <SignUp path="/signup" />
        <LogIn path="/login" />
        <MyPosts path="/myposts" />
      </Router>
    </div>
  );
}

export default App;
