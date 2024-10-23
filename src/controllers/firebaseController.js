const NotificationService = require("../service/NotificationService");

const sendFirebaseNotification = async (req, res) => {
  try {
    const { title, body, iconUrl, actionUrl } = req.body;
    await NotificationService.sendNotification(title, body, iconUrl, actionUrl);
    res
      .status(200)
      .json({ message: "notification sent successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const sendMultipleFirebaseNotification = async (req, res) => {
  try {
    const { title, body, iconUrl, actionUrl } = req.body;
    await NotificationService.sendMultipleNotification(
      title,
      body,
      iconUrl,
      actionUrl
    );
    res
      .status(200)
      .json({ message: "notification sent successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

async function sendEveryMinuteNotification() {
  const title = "Every Minute Notification";
  const body = "Hello from body";
  const deviceToken = "";

  await NotificationService.sendNotification(deviceToken, title, body);
}

const sendModificationOnCommunity = async (req, res) => {
  try {
    const { title, description, logoUrl, banniereUrl } = req.body;

    await NotificationService.sendOnFirebaseModificationOnCommunity(
      title,
      description,
      logoUrl,
      banniereUrl
    );
    res
      .status(200)
      .json({ message: "data community sent successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  sendFirebaseNotification,
  sendEveryMinuteNotification,
  sendMultipleFirebaseNotification,
  sendModificationOnCommunity,
};
