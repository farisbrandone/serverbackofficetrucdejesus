const admin = require("../utils/firebase");
const { format } = require("date-fns");
const dotenv = require("dotenv");
dotenv.config();
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
    throw new Error("failed to get device tokens");
  }
}

class NotificationService {
  static async sendNotification(title, body, iconUrl = "", actionUrl = "") {
    try {
      const deviceTokens = await getDeviceTokensss();

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

      return response;
    } catch (error) {
      throw new Error("putain de merde");
    }
  }

  static async sendMultipleNotification(title, body, iconUrl, actionUrl) {
    const deviceTokens = await getDeviceTokensss();
    console.log({
      title,
      body,
      iconUrl,
      actionUrl,
      deviceTokens: deviceTokens.length,
    });
    const messages = deviceTokens.map((token) => ({
      /*  notification: {
        title: title + "$-*" + iconUrl,
        body: body + "$-*" + actionUrl,
      }, */
      webpush: {
        headers: { Urgency: "high" },
        notification: {
          title: title,
          body: body,
          icon: iconUrl,
          badge:
            "https://trucdejesus.appowls.io/assets/apps/user_1837/app_3120/draft/icon/app_logo.png",
          actions: [
            {
              action: "Ouvrir",
              title: "Ouvrir",
              icon: "https://trucdejesus.appowls.io/assets/apps/user_1837/app_3120/draft/icon/app_logo.png",
            },
          ],
        },
        fcmOptions: {
          link: "https://untrucdejesus.vercel.app",
          collapseKey: "unique_key",
        },
      },
      token: token,
    }));

    try {
      const response = await admin.messaging().sendEach(messages);
      const ref = admin.firestore().collection("Notifications");
      const date = format(Date.now(), "'le' dd/MM/yyyy 'à' kk:mm");
      const result = await ref.add({ title, body, iconUrl, actionUrl, date });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async sendOnFirebaseModificationOnCommunity(
    title,
    description,
    logoUrl,
    banniereUrl
  ) {
    try {
      //const ref = admin.firestore().collection("CommunityData");
      const docRef = admin
        .firestore()
        .collection("CommunityData")
        .doc(process.env.COMMUNITYDATAID);
      const date = format(Date.now(), "'le' dd/MM/yyyy 'à' kk:mm");

      const result = await docRef.update({
        title,
        description,
        logoUrl,
        banniereUrl,
        date,
      });
      console.log(result);
      //await ref.
      /*  const result = await ref.add({
        title,
        description,
        logoUrl,
        banniereUrl,
        date,
      }); */
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NotificationService;
