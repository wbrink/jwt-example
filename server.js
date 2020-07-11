require("dotenv").config();

const express = require('express');
const app  = express();
const jwt = require("jsonwebtoken");
const path = require("path");

const publicDir = path.join(__dirname, "public");

const PORT = process.env.PORT || 3001;

const posts = [
  {
    username: "Jim",
    title: "POST 2"
  }, 
  {
    username: "Kyle",
    title: "Post 1"
  }
]

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.get("/test", authenticateToken, (req, res) => {
  console.log(req.headers);
  res.json(req.headers);
})

app.get("/post", (req,res) => {
  res.json(posts);
})

app.get("/", (req,res) => {
  res.sendFile(path.join(publicDir, "index.html"))
})


app.get("/login", (req,res) => {
  res.sendFile(path.join(publicDir, "login.html"))
})

app.post("/login", (req,res) => {
  // authenticate user step is skipped assume user logs in with valid credentials
  const username = req.body.username;
  const user = {user: username}
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({accessToken: accessToken});

})

function authenticateToken(req, res, next) {
  // get token verify that this is the correct user and return the user to the function that uses this middleware
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token. process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  })
}

// if in production use build folder for the static assets
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "client", "build")))
}

// send all other requests to inex.html so react takes over
app.get("*", (req,res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})


app.listen(PORT, () => console.log('Server Listening on Port', PORT));