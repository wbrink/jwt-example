const express = require("express");
const router = express.Router();


router.post("/api/login", (req,res) => {
  // authenticate user step is skipped assume user logs in with valid credentials
  const username = req.body.username;
  const user = {user: username}
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({accessToken: accessToken});

})


module.exports = router;