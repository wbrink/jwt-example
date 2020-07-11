require("dotenv").config();

const express = require('express');
const app  = express();
const jwt = require("jsonwebtoken");
const path = require("path");

const publicDir = path.join(__dirname, "public");

const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({extended: false}));


// get api router
app.use(require("./api-routes"));




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