const express = require("express");
const { loginPost } = require("../controllers/BackofficeController");
const router = express.Router();

router.post("/login", async (req, res) => {
  const result = await loginPost(req, res);
  return res.send(result);
});

module.exports = router;
