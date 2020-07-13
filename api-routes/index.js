const path = require("path");
const dotenvPath = path.join(__dirname, "../", ".env");
require('dotenv').config({path: dotenvPath})

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");


router.post("/api/login", (req,res) => {
  // authenticate user step is skipped assume user logs in with valid credentials
  const username = req.body.username;
  const user = {user: username}
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  
  res.json(accessToken);

})


router.get("/api/protected", authenticateToken, (req,res) => {
  res.json({allowed: "hello world"});
})



function authenticateToken(req, res, next) {
  // get token verify that this is the correct user and return the user to the function that uses this middleware
  const bearerHeader = req.headers['authorization'];

  // format of token
  // Authorization: Bearer <access_token>
  console.log(bearerHeader);
  const token = bearerHeader && bearerHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  })
}

module.exports = router;