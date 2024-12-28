const express = require("express");
const {
  sendFirebaseNotification,
  sendMultipleFirebaseNotification,
  sendModificationOnCommunity,
  sendMultipleFirebaseMessageNotification,
} = require("../controllers/firebaseController");
const router = express.Router();
router.post("/send-notification", async (req, res) => {
  const result = await sendFirebaseNotification(req, res);
  return res.send(result);
});

router.post("/send-multiple-notification", async (req, res) => {
  const result = await sendMultipleFirebaseNotification(req, res);
  return res.send(result);
});

router.post("/send-message-notification", async (req, res) => {
  const result = await sendMultipleFirebaseMessageNotification(req, res);
  return res.send(result);
});

router.post("/send-modification-on-community", async (req, res) => {
  const result = await sendModificationOnCommunity(req, res);
  return res.send(result);
});

module.exports = router;
