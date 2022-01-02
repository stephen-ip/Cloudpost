import React, { Component } from "react";
import "./PostCardFlip.css";
import ReactCardFlip from "react-card-flip";
import { FaUser } from "react-icons/fa";
import { BsClock, BsHandThumbsUp, BsHandThumbsDown } from "react-icons/bs";
import { RiArrowGoBackFill } from "react-icons/ri";
import { AiOutlineCalendar } from "react-icons/ai";
import axios from "axios";
import c from "classnames";
import { Image, Video } from "cloudinary-react";

export class PostCardFlip extends Component {
  constructor() {
    super();
    this.state = {
      isFlipped: false,
      likeActive: false,
      dislikeActive: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.setState((prevState) => ({ isFlipped: !prevState.isFlipped }));
  }

  setDislike() {
    this.setState({
      dislikeActive: !this.state.dislikeActive,
    });
  }
  setLike() {
    this.setState({
      likeActive: !this.state.likeActive,
    });
  }

  postLike(key) {
    axios
      .post("https://my-worker.stephenip.workers.dev/posts/like", {
        key: key,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  postDislike(key) {
    axios
      .post("https://my-worker.stephenip.workers.dev/posts/dislike", {
        key: key,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  postUnlike(key) {
    axios
      .post("https://my-worker.stephenip.workers.dev/posts/unlike", {
        key: key,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  postUndislike(key) {
    axios
      .post("https://my-worker.stephenip.workers.dev/posts/undislike", {
        key: key,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleLike(key) {
    if (this.state.likeActive) {
      this.postUnlike(key);
    } else if (this.state.dislikeActive) {
      axios
        .post("https://my-worker.stephenip.workers.dev/posts/undislike", {
          key: key,
        })
        .then((response) => {
          console.log(response);
          this.postLike(key);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.postLike(key);
    }

    if (this.state.dislikeActive) {
      this.setLike();
      this.setDislike();
    } else {
      this.setLike();
    }
  }

  handleDislike(key) {
    if (this.state.dislikeActive) {
      this.postUndislike(key);
    } else if (this.state.likeActive) {
      axios
        .post("https://my-worker.stephenip.workers.dev/posts/unlike", {
          key: key,
        })
        .then((response) => {
          console.log(response);
          this.postDislike(key);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.postDislike(key);
    }

    if (this.state.likeActive) {
      this.setDislike();
      this.setLike();
    } else {
      this.setDislike();
    }
  }

  render() {
    return (
      <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="vertical">
        <div>
          <button className="PostFront" onClick={this.handleClick}>
            <div className="PostTitleContainer">
              <h2 className="PostTitle">{this.props.title}</h2>
            </div>
            <div className="PostDetails">
              <div className="usertimeColumn">
                <div className="PostCreator">
                  <FaUser className="usericon" />
                  {this.props.username}
                </div>
                <div className="PostTime">
                  <div className="Date">
                    <AiOutlineCalendar className="calendaricon" />
                    {this.props.date}
                  </div>
                  <div className="Time">
                    <BsClock className="clockicon" />
                    {this.props.time}
                  </div>
                </div>
              </div>
              <div className="PostRatings">
                <div className="Likes">
                  <BsHandThumbsUp className="likeicon" />
                  {this.props.likes}
                </div>
                <div className="Dislikes">
                  <BsHandThumbsDown className="dislikeicon" />
                  {this.props.dislikes}
                </div>
              </div>
            </div>
          </button>
        </div>

        <div>
          <div className="PostBack">
            {this.props.filecontentformat === "jpg" ||
            this.props.filecontentformat === "jpeg" ||
            this.props.filecontentformat === "png" ||
            this.props.filecontentformat === "gif"? (
              <Image
                className="FileContentImage"
                cloudName={process.env.REACT_APP_CLOUD_NAME}
                publicId={this.props.filecontent}
              />
            ) : null}
            {(this.props.filecontentformat === "mp4" && this.state.isFlipped === true) ? (
              <Video
                className="FileContentVideo"
                cloudName={process.env.REACT_APP_CLOUD_NAME}
                publicId={this.props.filecontent}
                controls
                poster={this.props.filecontentposter}
              />
            ) : null}
            <textarea className="post_content" readOnly>
              {this.props.content}
            </textarea>
            <div className="PostBackActions">
              <button className="ReturnButton" onClick={this.handleClick}>
                <RiArrowGoBackFill />
              </button>
              <div className="RatePost">
                <button
                  className={c("LikeButton", {
                    ["likeactive"]: this.state.likeActive,
                  })}
                  onClick={() => {
                    this.handleLike(this.props.key_value);
                  }}
                >
                  <BsHandThumbsUp className="likeicon" />
                </button>
                <button
                  className={c("DislikeButton", {
                    ["dislikeactive"]: this.state.dislikeActive,
                  })}
                  onClick={() => {
                    this.handleDislike(this.props.key_value);
                  }}
                >
                  <BsHandThumbsDown className="dislikeicon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </ReactCardFlip>
    );
  }
}

export default PostCardFlip;
