const path = require("path");
const dotenvPath = path.join(__dirname, "../", ".env");
require('dotenv').config({path: dotenvPath})

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { access } = require("fs");


// this would be stored in the database in production
let refreshTokens = [];


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
    // res.json({accessToken})
  });
})

// delete the refreshtoken
router.delete("/logout", (req,res) => {
  refreshTokens = refreshTokens.filter(elem => token !== req.cookies.refreshToken);
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


// jsonwebtoken generate access token creates jwt with user payload
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15s"});
}


router.get("/api/protected", authenticateToken, (req,res) => {
  res.json({allowed: "hello world"});
})



function authenticateToken(req, res, next) {
  // get token verify that this is the correct user and return the user to the function that uses this middleware
  // const bearerHeader = req.headers['authorization'];

  // // format of token
  // // Authorization: Bearer <access_token>
  // const token = bearerHeader && bearerHeader.split(' ')[1];

  // // if token is null send response 
  // if (token == null) {return res.sendStatus(401)}
  
  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  //   if (err) {
  //     return res.sendStatus(403);
  //   }
  //   req.user = user;
  //   next();
  // })

  // when the accessToken cookie expires is deleted (will be read as null)
  const accessToken = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;
  

  if (accessToken == null) {
    console.log("accessToken is null");
    return res.sendStatus(401);
  } else {
    // verify the token
    console.log("Verifying the token");
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
    })
  }

  next();
}

module.exports = router;