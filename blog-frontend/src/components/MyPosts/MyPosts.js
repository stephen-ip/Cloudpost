import React, { useEffect, useState } from "react";
import { Link, navigate } from "@reach/router";
import "./MyPosts.css";
import { Spinner } from "react-bootstrap";
import PostCardFlip from "../PostCardFlip";
import { IoHomeOutline } from "react-icons/io5";
import { RiLogoutBoxRLine } from "react-icons/ri";
import axios from "axios";

const Loading = () => {
  return (
    <div>
      <Spinner animation="border" />
    </div>
  );
};

const MyPosts = () => {
  const [user, setUser] = useState({
    logged_in: false,
    username: "",
    email: ""
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    checkLoginStatus();
    const getPosts = async () => {
      setLoading(true);
      axios
        .get("https://cloudpost-backend-auth.herokuapp.com/myposts", {withCredentials:true})
        .then((response) => {
          const postsResp = response.data;
          setPosts(postsResp);
          setLoading(false);
        });
    };
    getPosts();
  }, []);

  function handleLogOut() {
    axios
      .post("https://cloudpost-backend-auth.herokuapp.com/logout", {withCredentials:true})
      .then((response) => {
        console.log("logged out");
        navigate("/")
      })
      .catch((error) => {
        console.log(error);
      })
  };

  return (
    <div className="MyPosts">
      {user.logged_in ? (
      <div className="Content">
        <div className="Header">
          <h1 className="PostsTitle">My Posts</h1>
          <h1 className="Loading">{loading ? <Loading /> : null}</h1>
          <div className="Navbar">
            <h2 className="ProfileUsername">{user.logged_in ? user.username : null}</h2>
            <Link to="/" className="toPosts" style={{ textDecoration: 'none' }}>
              <IoHomeOutline className="HomeIcon" />
              Home
            </Link>
            <button className="LogOutButton" onClick={handleLogOut} style={{ textDecoration: 'none' }}>
              <RiLogoutBoxRLine className="LogOutIcon"/>
              Log Out
            </button>
          </div>
        </div>
        <div className="PostsContainer">
          {posts.map((post) => (
            <div className="Post" key={post.key}>
              <PostCardFlip
                key_value={post.key}
                title={post.title}
                username={post.username}
                content={post.content}
                filecontent={post.filecontent}
                filecontentformat={post.filecontentformat}
                filecontentposter={post.filecontentposter}
                date={post.date}
                time={post.time}
                likes={post.likes}
                dislikes={post.dislikes}
              />
            </div>
          ))}
        </div>
      </div> ) :
      <div className="NotLoggedInPrompt">
        <h2>You must be logged in to view your posts</h2>
          <div className="redirectOptions">
            <a className="redirecttoLogIn" href="/login">Log In</a>
            <a className="redirecttoSignUp" href="/signup">Sign Up</a>
          </div>
      </div> }
    </div>
  );
};

export default MyPosts;
