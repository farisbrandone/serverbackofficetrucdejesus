const admin = require("../utils/firebase");
const { format } = require("date-fns");
async function getDeviceTokensss() {
  let registrationTokens = [];
  try {
    const ref = admin.firestore().collection("DeviceTokens");
    const dataOfDeviceTokens = await ref.get();
    dataOfDeviceTokens.forEach((doc) => {
      registrationTokens.push(doc.data().token);
    });
    return registrationTokens;
  } catch (error) {
    console.log("get device tokens: ", error.message);
    throw new Error("failed to get device tokens");
  }
}

class NotificationService {
  static async sendNotification(title, body, iconUrl = "", actionUrl = "") {
    try {
      const deviceTokens = await getDeviceTokensss();
      console.log({ title, body, iconUrl, actionUrl });
      /*  const { title, body } = { title: "notif", body: "new" }; */
      const message = {
        notification: {
          title: title + "$-*" + iconUrl,
          body: body + "$-*" + actionUrl,
        },
        token: deviceTokens[0],
      };
      /**promise all pour envoyer et stocker le message en meme temps */
      const response = await admin.messaging().send(message);
      const ref = admin.firestore().collection("Notifications");
      const date = format(Date.now(), "'le' dd/MM/yyyy 'à' kk:mm");
      const result = await ref.add({ title, body, iconUrl, actionUrl, date });
      console.log({ result: result });
      console.log({ response });
      return response;
    } catch (error) {
      console.error(error);
      throw new Error("putain de merde");
    }
  }

  static async sendMultipleNotification(title, body, iconUrl, actionUrl) {
    const deviceTokens = await getDeviceTokensss();
    console.log(deviceTokens);
    const messages = deviceTokens.map((token) => ({
      notification: {
        title: title + "$-*" + iconUrl,
        body: body + "$-*" + actionUrl,
      },
      token: token,
    }));

    try {
      const response = await admin.messaging().sendEach(messages);
      const ref = admin.firestore().collection("Notifications");
      const date = format(Date.now(), "'le' dd/MM/yyyy 'à' kk:mm");
      const result = await ref.add({ title, body, iconUrl, actionUrl, date });
      return response;
    } catch (error) {
      console.log("out ohhhh");
      throw error;
    }
  }
}

module.exports = NotificationService;
