const path = require("path");
const dotenvPath = path.join(__dirname, "../", ".env");
require('dotenv').config({path: dotenvPath})

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// authentication middleware
const isAuthenticated = require("../middleware/auth");
const generateAccessToken = require("../utils/generateAccessToken");

// this would be stored in the database in production
let refreshTokens = require("../db");


// get new access token from the refresh token
router.post("/api/token", (req,res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({name: user.name});
    res.cookie("token", accessToken, {httpOnly: true, expires: new Date(Date.now() + 15000)}) // set the expiry to be same as jwt 
    res.json({accessToken})
  });
})



// delete the refreshtoken
router.get("/api/logout", (req,res) => {
  // remove the refresh token from the list of verified refreshTokens
  refreshTokens = refreshTokens.filter(elem => elem !== req.cookies.refreshToken);

  // There is no way to delete a cookie but you can set the expiry to date in the past
  // res.cookie("token", accessToken, {httpOnly: true, expires: new Date(Date.now())}) // set the expiry to be same as jwt 
  // res.cookie("refreshToken", refreshToken, {httpOnly: true, expires: new Date(Date.now())});

  // must make sure that the path and domain will be the same as when the cookies were set
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.sendStatus(204); 
})



router.post("/api/login", (req,res) => {
  // authenticate user step is skipped assume user logs in with valid credentials
  const username = req.body.username;
  const user = {user: username}
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET) // MANUALLY HANDLE THE EXPIRATION OF REFRESH
  refreshTokens.push(refreshToken);
  
  res.cookie("token", accessToken, {httpOnly: true, expires: new Date(Date.now() + 15000)}) // set the expiry to be same as jwt 
  res.cookie("refreshToken", refreshToken, {httpOnly: true});
  res.json({accessToken, refreshToken});

})


router.get("/api/protected", isAuthenticated, (req,res) => {
  res.json({allowed: "hello world"});
})




module.exports = router;