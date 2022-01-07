import React, { useEffect, useState } from "react";
import { Link } from "@reach/router";
import "./Posts.css";
import { Spinner } from "react-bootstrap";
import PostCardFlip from "./PostCardFlip";
import { IoCreate } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { RiLoginBoxLine } from "react-icons/ri";
import { AiOutlineUserAdd } from "react-icons/ai";
import axios from "axios";

const Loading = () => {
  return (
    <div>
      <Spinner animation="border" />
    </div>
  );
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    logged_in: false,
    username: "",
    email: ""
  });

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
      const resp = await fetch("https://my-worker.stephenip.workers.dev/posts");
      const postsResp = await resp.json();
      setPosts(postsResp);
      setLoading(false);
      // setTimeout(() => getPosts(), 3000);  // Uncomment to have auto posts update. Comment to save resources used
    };
    getPosts();
  }, []);

  return (
    <div className="Posts">
      <div className="Content">
        <div className="Header">
          <h1 className="PostsTitle">Posts</h1>
          <h1 className="Loading">{loading ? <Loading /> : null}</h1>
          {user.logged_in ? (
            <div className="Navbar">
              <Link to="/post" className="toPost" style={{ textDecoration: 'none' }}>
                <IoCreate className="MakePostIcon" />
                Post
              </Link>
              <Link to="/myposts" className="toProfile" style={{ textDecoration: 'none' }}>
                <CgProfile className="ProfileIcon" />
                {user.username}
              </Link>
            </div>
          ) : (
            <div className="Navbar">
              <Link to="/login" className="toLogIn" style={{ textDecoration: 'none' }}>
                <RiLoginBoxLine className="LogInIcon" />
                Log In
              </Link>
              <Link to="/signup" className="toSignUp" style={{ textDecoration: 'none' }}>
                <AiOutlineUserAdd className="SignUpIcon" />
                Sign Up
              </Link>
            </div>
          )}
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
      </div>
    </div>
  );
};

export default Posts;
