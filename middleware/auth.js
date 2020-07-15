const jwt = require("jsonwebtoken");

// import the saved refresh tokens
const refreshTokens = require("../db");
const generateAccessToken = require("../utils/generateAccessToken");

function authenticateTokenMiddleware(req, res, next) {
  
  // when the accessToken cookie expires is deleted (will be read as null)
  console.log("refresh tokens", refreshTokens);
  const accessToken = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;
  

  // if accessToken is nonexistant
  if (accessToken == null) {
    console.log("accessToken is null");
    // try and refresh token
    if (refreshToken !== null) {
      if (!refreshTokens.includes(refreshToken)) {
        console.log("refresh token not in database");
        return res.sendStatus(403);
      }
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({name: user.name});
        console.log("access token generated because of refresh token");
        // send an access token
        res.cookie("token", accessToken, {httpOnly: true, expires: new Date(Date.now() + 15000)}) // set the expiry to be same as jwt 
        req.user = {name: user.name}
        next();
      });
    } else {
      return res.sendStatus(403);
    }

  }
  // if access token is not null 
  else {
    // verify the token
    console.log("Verifying the token");
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    })
  }
}


module.exports = authenticateTokenMiddleware;