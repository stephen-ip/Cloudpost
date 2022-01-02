import React, { useState } from "react";
import "./Post.css";
import { Link } from "@reach/router";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Spinner } from "react-bootstrap";
import { BsArrowReturnLeft } from "react-icons/bs";

const Result = () => {
  return <p>Your post has been successfully uploaded!</p>;
};

const ErrorCloudflare = () => {
  return <p>Error creating post. Try again later.</p>;
};

const ErrorCloudinary = () => {
  return <p>Error uploading file content. Try a different file.</p>;
};

const Sending = () => {
  return (
    <div>
      <Spinner animation="border" />
    </div>
  );
};

const CAPTCHAprompt = () => {
  return <p>Please complete the reCAPTCHA</p>;
};

function Post() {
  const [body, setBody] = useState({
    username: "",
    title: "",
    content: "",
    filecontent: null,
    filecontentformat: null,
    filecontentposter: null
  });

  const [completeCAPTCHA, setCompleteCAPTCHA] = useState(false);
  const [verified, setVerified] = useState(false);
  const [result, showResult] = useState(false);
  const [errorCloudinary, showErrorCloudinary] = useState(false);
  const [errorCloudflare, showErrorCloudflare] = useState(false);
  const [sending, showSending] = useState(false);

  function changeHandler(e) {
    const newBody = { ...body };
    newBody[e.target.id] = e.target.value;
    setBody(newBody);
  }

  function handleFile(e) {
    let file = e.target.files[0]
    var newBody = { ...body };
    newBody["filecontent"] = file
    setBody(newBody);
  }

  function onChange(value) {
    console.log("Captcha value:", value);
    setVerified(true);
    setCompleteCAPTCHA(false);
  }

  function postRequest(e) {
    e.preventDefault();
    if (verified === false) {
      setCompleteCAPTCHA(true);
      setTimeout(() => {
        setCompleteCAPTCHA(false);
      }, 5000);
      return;
    }
    showSending(true);
    if (body.filecontent === null) {
      axios
        .post("https://my-worker.stephenip.workers.dev/posts", body)
        .then((response) => {
          console.log(response);
          showSending(false);
          showResult(true);
        })
        .catch((error) => {
          console.log(error);
          showSending(false);
          showErrorCloudflare(true);
        });
    }
    else {
      let formdata = new FormData()
      formdata.append('file', body.filecontent)
      formdata.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET)
      axios
        .post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/auto/upload`, formdata)
        .then((response) => {
          console.log(response)
          axios
          .post("https://my-worker.stephenip.workers.dev/posts", {
            username: body.username,
            title: body.title,
            content: body.content,
            filecontent: response.data.secure_url,
            filecontentformat: response.data.format,
            filecontentposter: response.data.secure_url.replace(/\.[^/.]+$/, ".jpg")
          })
          .then((response) => {
            console.log(response);
            showSending(false);
            showResult(true);
          })
          .catch((error) => {
            console.log(error);
            showSending(false);
            showErrorCloudflare(true);
          });
        })
        .catch((error) => {
          console.log(error);
          showSending(false);
          showErrorCloudinary(true);
        });
    }
    setVerified(false);
    window.grecaptcha.reset();
  }

  setTimeout(() => {
    showResult(false);
    showErrorCloudflare(false);
    showErrorCloudinary(false);
  }, 5000);

  return (
    <div className="CreatePost">
      <form className="CreatePostForm" onSubmit={(e) => postRequest(e)}>
        <div className="title">
          <h2>Create Post</h2>
        </div>
        <div className="half">
          <div className="item">
            <label for="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={body.username}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className="item">
            <label for="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={body.title}
              onChange={(e) => changeHandler(e)}
              required
              placeholder="Max 30 characters"
              maxlength = "30"
            />
          </div>
        </div>
        <div className="full">
          <label for="content">Content</label>
          <textarea
            name="content"
            id="content"
            value={body.content}
            onChange={(e) => changeHandler(e)}
            required
          ></textarea>
        </div>
        <div className="FileContentUpload">
          <label for="filecontent">File Content</label>
          <input type="file" name="filecontent" onChange={(e) => handleFile(e)}></input>
        </div>
        <div className="action">
          <Link to="/" className="toHome">
            <BsArrowReturnLeft className="ReturnArrowIcon"/>
            Return
          </Link>
          <ReCAPTCHA
            sitekey="6Ld_hM4dAAAAAKoqdJaaT9KHl53q-dfOY0RusKh8"
            onChange={onChange}
          />
          <input type="submit" value="Post" />
        </div>
        <div className="Status">
          <h2 className="CaptchaPrompt">
            {completeCAPTCHA ? <CAPTCHAprompt /> : null}
          </h2>
          <h2 className="FormResult">{result ? <Result /> : null}</h2>
          <h2 className="Sending">{sending ? <Sending /> : null}</h2>
          <h2 className="ErrorMessage">{errorCloudflare ? <ErrorCloudflare /> : null}</h2>
          <h2 className="ErrorMessage">{errorCloudinary ? <ErrorCloudinary /> : null}</h2>
        </div>
      </form>
    </div>
  );
}

export default Post;
