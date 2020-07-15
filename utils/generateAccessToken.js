const jwt = require("jsonwebtoken");

// jsonwebtoken generate access token creates jwt with user payload
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15s"});
}


module.exports = generateAccessToken;