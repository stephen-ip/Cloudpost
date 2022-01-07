require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
)
app.use(express.json());
app.use(cookieParser());

const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri);
client.connect();
const users = client.db("Cloudpost").collection("Users");

// home route
app.get("/", function (req, res) {
  res.send("Auth Server");
});

app.post("/signup", (req, res) => {
  const { username, email, password, passwordConfirm } = req.body;

  // verify username length
  if (username.length < 3 || username.length > 20) return res.send("Username must be between 3 and 20 characters")

  // verify passwords match
  if (password !== passwordConfirm) return res.send("Passwords do not match");

  let user_p = users.findOne({ username: username });
  user_p.then(function (user) {
    // check if user with same username is already in db
    if (user != null) return res.send("A user with the username provided already exists");

    // if not, add user to database with encrypted password
    bcrypt.hash(password, 10, function (err, hash) {
      user = {
        username: username,
        email: email,
        password: hash,
      };
      let result_p = users.insertOne(user);
      result_p.then(function (result) {
        return res.send("Successfully created account");
      });
    });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  let user_p = users.findOne({ username: username });
  user_p.then(function (user) {
    // check if user with username exists
    if (user === null) return res.send("No user with this username was found");

    // check to see if password is correct
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === false) return res.send("Password is not correct");

      // generate user access token
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      //   const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      //   refreshTokens.push(refreshToken);
      //   res.json({ accessToken: accessToken, refreshToken: refreshToken });
      return res
        .cookie('token', accessToken, {
          httpOnly: true,
          maxAge: 900000  // needed in order to clear cookie?
        })
        .json({message: "success"});
    });
  });
});

app.post("/logout", (req, res) => {
  return res.clearCookie('token', {httpOnly: true, maxAge: 900000}).json({message: "success"});
})

app.get("/logged_in", authenticateToken, (req, res) => {
  // if the token was successfully authenticated:
  return res.json({
    logged_in: true,
    username: req.user.username,
    email: req.user.email
  })
})

app.get("/myposts", authenticateToken, (req, res) => {
  // get posts from wrangler kv
  posts = axios
    .get("https://my-worker.stephenip.workers.dev/posts")
    .then(function (response) {
        // filter response to only have posts made by the user
        res.json(response.data.filter((post) => post.username == req.user.username));
    })
    .catch(function (error) {
      console.log(error);
    });
});

function authenticateToken(req, res, next) {
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  const token = req.cookies.token || '';
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(PORT, function () {
  console.log("listening to port: " + PORT);
});
