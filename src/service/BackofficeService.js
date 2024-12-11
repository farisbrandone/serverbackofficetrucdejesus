const admin = require("../utils/firebase");
const jwt = require("jsonwebtoken");

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
      const snapshot1 = await admin
        .firestore()
        .collection("MemberWaitingData")
        .get();
      snapshot1.forEach((doc) => {
        if (doc.data().email === data.email) {
          result1.push(doc.data());
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
        .firestore()
        .collection("EmailNotificationData")
        .get();
      snapshot.forEach((doc) => {
        result.push(doc.data());
      });
      console.log({ result });

      const ref = admin.firestore().collection("MemberWaitingData");
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
          console.log(info);
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

      let result1 = [];
      const snapshot1 = await admin.firestore().collection("MemberData").get();
      snapshot1.forEach((doc) => {
        if (doc.data().email === data.email) {
          result1.push(doc.data());
        }
      });

      if (result1.length > 0) {
        return {
          success: "Cette adresse fait dejà partir membres",
          error: "not error",
          alreadyExist: true,
        };
      }

      const ref = admin.firestore().collection("MemberData");
      const resultOfStore = await ref.add({ ...data });

      const snapshot = await admin
        .firestore()
        .collection("BulkNotificationData")
        .get();
      snapshot.forEach((doc) => {
        result.push(doc.data());
      });
      console.log({ result });

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

      const user = await admin.auth().createUser({
        email: data.email,
        emailVerified: false,
        password: data.password,
        disabled: false,
      });

      console.log(user);

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
}

module.exports = BackofficeService;
