const express = require("express");
const {
  signupFrontPost,
  accceptSignupFrontPost,
  loginFrontPost,
  getMemberWithEmail,
  getUrlFileApp,
} = require("../controllers/BackofficeController");
const { updateUser } = require("../service/BackofficeService");
//const multer = require("multer");
const router = express.Router();
//const upload = multer({ dest: "uploads/" });
router.post("/signup", async (req, res) => {
  const result = await signupFrontPost(req, res);
  return res.send(result);
});

router.post("/acceptsignup", async (req, res) => {
  const result = await accceptSignupFrontPost(req, res);
  return res.send(result);
});

router.post("/login", async (req, res) => {
  const result = await loginFrontPost(req, res);
  return res.json(result);
});

router.post("/updateuser", async (req, res) => {
  const result = await updateUser(req, res);
  return res.json(result);
});

router.post("/getmemberwithemail", async (req, res) => {
  const result = await getMemberWithEmail(req, res);
  return res.json(result);
});

router.post(
  "/geturlfile",
  /*  upload.single("file"), */ async (req, res) => {
    const result = await getUrlFileApp(req, res);
    return res.json(result);
  }
);

module.exports = router;
