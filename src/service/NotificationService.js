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



async function getDeviceTokensMessage() {
  let registrationTokens = [];
  try {
    const ref = admin.firestore().collection("DeviceForReseauSocialData");
    const dataOfDeviceTokens = await ref.get();
    dataOfDeviceTokens.forEach((doc) => {
      registrationTokens.push(doc.data());
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

    const messages = deviceTokens.map((token) => ({
      data: {
        title: title + "$-*" + iconUrl,
        body: body + "$-*" + actionUrl,
      },
      /*  webpush: {
        headers: { Urgency: "high" },
        data: {
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
          //collapseKey: uniqueKey,
        },
      }, */
      token: token,
    }));

    try {
      const response = await admin.messaging().sendEach(messages);
      const ref = admin.firestore().collection("Notifications");
      const date = new Date().toUTCString();

      const result = await ref.add({ title, body, iconUrl, actionUrl, date });

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async sendMultipleMessageNotification(req, res) {

/* export interface DeviceForReseauSocialDataType {
  deviceNumber: string;
  user: MembreData;
  dateOfCreation?: string;
  dateOfUpdate?: string;
  id?: string;
}


{user, message}
 */


 /* 
 export interface MessageData {
  dateOfCreation?: string;
  dateOfUpdate?: string;
  id?: string;
  userReceiverId?: string;
  userReceiverEmail?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail?: string;
  text: string;
  photo: string;
  audio: string;
  video: string;
  othersFile: string;
  userLikes: string[];
  groupeName: string;
  groupeId?: string;
  communityId: string;
  typeMessage: string;
}
 
 
 */

    const deviceTokens = await getDeviceTokensMessage();
    const value = req.body;
    const trueDevice=deviceTokens.filter((val)=>!!value.user.find((us)  =>us.email=== val.user.email))
    const messages = trueDevice.map((deviceToken) => ({
      data: {
        title: `${value.message.userName}` + "$-*" + `${value.message.userAvatar}`,
        body: `${value.message.text}` + "$-*" + `https://reseausocial-trucdejesus.vercel.app/community/00wOWSI8yjxruMrzbXk3/${value.message.groupeId}`,
      },
      token: deviceToken.deviceNumber,
    }));

    try {
      const response = await admin.messaging().sendEach(messages);
      const ref = admin.firestore().collection("NotificationMessageData");
      const date = new Date().toUTCString();

      const result = await ref.add({ ...value, dateOfCreation:date});

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
      const date = new Date().toUTCString();

      const result = await docRef.update({
        title,
        description,
        logoUrl,
        banniereUrl,
        date,
      });

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
