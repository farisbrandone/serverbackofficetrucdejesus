const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { secondaryApp, admin2 } = require("../../firebaseForFile");
const { admin, defaultApp } = require("../utils/firebase");
//const multer = require("multer");
//const path = require("path");
class BackofficeService {
  static async loginUserBackoffice(email, password) {
    let role = "";
    try {
      if (email === process.env.EMAIL || password === process.env.PASSWORD) {
        role = "superAdmin";
        //récupération des données du super admin dans la base de donn&es client
        //et transfert au token
        const token = jwt.sign({ userEmail: email }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });
        return { token };
      }
      //ici vérification si la personne est dans la base de données client
    } catch (error) {
      throw new Error("La connection à échouer");
    }
  }

  static async signupFrontOffice(data) {
    try {
      let result = [];
      let result1 = [];

      let result2 = [];
      const snapshot2 = await admin
        .firestore(defaultApp)
        .collection("MemberData")
        .get();
      snapshot2.forEach((doc) => {
        if (doc.data().email === data.email) {
          result2.push({ ...doc.data(), id: doc.id });
        }
      });

      if (result2.length > 0) {
        return {
          success: "Cette adresse fait dejà partir membres",
          error: "not error",
          alreadyExist: true,
        };
      }

      const snapshot1 = await admin
        .firestore(defaultApp)
        .collection("MemberWaitingData")
        .get();
      snapshot1.forEach((doc) => {
        if (doc.data().email === data.email) {
          result1.push({ ...doc.data(), id: doc.id });
        }
      });

      if (result1.length > 0) {
        return {
          success: "Votre adresse existe dejà dans les mails en attente",
          error: "not error",
          alreadyExist: true,
        };
      }
      const snapshot = await admin
        .firestore(defaultApp)
        .collection("EmailNotificationData")
        .get();
      snapshot.forEach((doc) => {
        result.push({ ...doc.data(), id: doc.id });
      });

      const ref = admin.firestore(defaultApp).collection("MemberWaitingData");
      const resultOfStore = await ref.add({ ...data });

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "farisbrandone0@gmail.com",
          pass: process.env.APP_PASSWORD,
        },
      });

      var mailoutput = result[0].messageOfEmail;

      var mailOptions = {
        from: "farisbrandone0@gmail.com",
        to: data.email,
        subject: result[0].subject,
        html: mailoutput,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          throw new Error("Votre email semble ne pas éxister");
        } else {
        }
      });

      return {
        success: "Opération effectuée avec success",
        error: "not error",
        alreadyExist: false,
      };
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  static async acceptSignupFrontOffice(data) {
    try {
      let result = [];
      let myId = "";
      let result1 = [];
      let result2 = [];
      const snapshot1 = await admin
        .firestore(defaultApp)
        .collection("MemberData")
        .get();
      snapshot1.forEach((doc) => {
        if (
          doc.data().email === data.email &&
          doc.data().groupeId.includes(data.groupeId)
        ) {
          result1.push({ ...doc.data() });
        }
        if (
          doc.data().email === data.email &&
          !doc.data().groupeId.includes(data.groupeId)
        ) {
          result2.push({ ...doc.data() });
          myId = doc.id;
        }
      });

      if (result1.length > 0) {
        return {
          success: "Vous ete deja inscrit dans ce groupe",
          error: "not error",
          alreadyExist: true,
        };
      }
      if (result2.length > 0) {
        const value = result2[0];
        const groupeId = value.groupeId.push(data.groupeId);
        const dataToUpdate = { groupeId };
        const ref = admin
          .firestore(defaultApp)
          .collection("MemberData")
          .doc(myId);
        const resultOfStore = await ref.update(dataToUpdate);
        return {
          success: "Opération effectuée avec success",
          error: "not error",
          alreadyExist: false,
        };
      }

      const ref = admin.firestore(defaultApp).collection("MemberData");
      const {
        name,
        email,
        motsDepasse,
        sexe,
        birthDay,
        phone,
        status,
        image,
        communityId,
        dateOfCreation,
        dateOfUpdate,
        nombrePartage,
        nombreLikes,
        nombreCommentaire,
        nombreDeMerciBenis,
        nombreDactivite,
        nombreDeBadge,
      } = data;

      const myData = {
        name,
        email,
        motsDepasse,
        sexe,
        birthDay,
        phone,
        status,
        image,
        communityId,
        dateOfCreation,
        dateOfUpdate,
        nombrePartage,
        nombreLikes,
        nombreCommentaire,
        nombreDeMerciBenis,
        nombreDactivite,
        nombreDeBadge,
      };
      const dataToSend = { ...myData, groupeId: [data.groupeId] };

      const resultOfStore = await ref.add({ ...dataToSend });

      const snapshot = await admin
        .firestore(defaultApp)
        .collection("BulkNotificationData")
        .get();
      snapshot.forEach((doc) => {
        result.push({ ...doc.data(), id: doc.id });
      });

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "farisbrandone0@gmail.com",
          pass: process.env.APP_PASSWORD,
        },
      });

      var mailoutput = result[0].messageOfEmailBulk;

      var mailOptions = {
        from: "farisbrandone0@gmail.com",
        to: data.email,
        subject: result[0].subjectBulk,
        html: mailoutput,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          throw new Error("Votre email semble ne pas éxister");
        } else {
          console.log(info);
        }
      });

      const user = await secondaryApp.auth().createUser({
        email: data.email,
        emailVerified: false,
        avatar: data.image,
        password: data.password,
        disabled: false,
      });

      return {
        success: "Opération effectuée avec success",
        error: "not error",
        alreadyExist: false,
      };
    } catch (error) {
      console.log({ papaou: error.message });
      throw new Error(error.message);
    }
  }

  static async loginFrontkoffice(email, password, image) {
    try {
      let result2 = [];
      let result1 = [];

      let myId = "";
      const snapshot1 = await admin
        .firestore(defaultApp)
        .collection("MemberData")
        .get();
      snapshot1.forEach((doc) => {
        if (doc.data().email === email && doc.data().motsDepasse === password) {
          myId = doc.id;
          result1.push({ ...doc.data(), id: doc.id });
        }
      });

      const snapshot2 = await admin
        .firestore(defaultApp)
        .collection("MemberWaitingData")
        .get();
      snapshot2.forEach((doc) => {
        if (
          doc.data().email === data.email &&
          doc.data().motsDepasse === password
        ) {
          result2.push({ ...doc.data(), id: doc.id });
        }
      });

      if (result2.length > 0) {
        return {
          data: {},
          token: "",
          status: "membre en attente",
        };
      }

      if (result1.length > 0) {
        if (!result1[0].image) {
          const ref = admin
            .firestore(defaultApp)
            .collection("MemberData")
            .doc(myId);
          const resultOfStore = await ref.update({ image });
        }
        const token = jwt.sign({ email, password }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });

        //const user = await secondaryApp.auth().getUserByEmail(req.params.email);

        return {
          data: result1[0],
          token,
          status: "membre deja inscrit",
        };
      } else {
        return {
          data: {},
          token: "",
          status: "membre ni inscrit ni en attentes",
        };
      }
    } catch (error) {
      throw new Error("La connection à échouer");
    }
  }

  static async getMemberWithEmail(email) {
    try {
      let result1 = [];
      const snapshot1 = await admin
        .firestore(defaultApp)
        .collection("MemberData")
        .get();
      snapshot1.forEach((doc) => {
        if (doc.data().email === email) {
          result1.push({ ...doc.data(), id: doc.id });
        }
      });

      if (result1.length > 0) {
        return {
          data: result1[0],
        };
      }
    } catch (error) {
      throw new Error("La connection à échouer");
    }
  }
  static async getUrlFile() {
    let token = "";
    const uid = process.env.SECRET_KEY;

    try {
      token = await admin.auth(secondaryApp).createCustomToken(uid);

      return token;
    } catch (error) {
      console.log({ error: error.message });
    }
  }
  static async updateUser(data) {
    try {
      const ref = admin
        .firestore(defaultApp)
        .collection("MemberData")
        .doc(data.body.id);
      const resultOfStore = await ref.update({ ...data.body.data });

      await admin.auth(secondaryApp).deleteUser(data.body.uid);
      return {
        message: "mise à jour effectué avec succes",
        update: true,
      };
    } catch (error) {
      throw new Error("La connection à échouer");
    }
  }
}

module.exports = BackofficeService;
