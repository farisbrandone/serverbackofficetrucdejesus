const express = require("express");
const {
  signupFrontPost,
  accceptSignupFrontPost,
} = require("../controllers/BackofficeController");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const result = await signupFrontPost(req, res);
  return res.send(result);
});

router.post("/acceptsignup", async (req, res) => {
  const result = await accceptSignupFrontPost(req, res);
  return res.send(result);
});

module.exports = router;
