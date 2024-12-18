const admin = require("../utils/firebase");
const admin2 = require("../../firebaseForFile");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
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
      const snapshot2 = await admin.firestore().collection("MemberData").get();
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
        .firestore()
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
        .firestore()
        .collection("EmailNotificationData")
        .get();
      snapshot.forEach((doc) => {
        result.push({ ...doc.data(), id: doc.id });
      });

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
      const snapshot1 = await admin.firestore().collection("MemberData").get();
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
        const ref = admin.firestore().collection("MemberData").doc(myId);
        const resultOfStore = await ref.update(dataToUpdate);
        return {
          success: "Opération effectuée avec success",
          error: "not error",
          alreadyExist: false,
        };
      }

      const ref = admin.firestore().collection("MemberData");
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
        .firestore()
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

      const user = await admin2.auth().createUser({
        email: data.email,
        emailVerified: false,
        avatar: data.image,
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

  static async loginFrontkoffice(email, password) {
    try {
      let result1 = [];
      const snapshot1 = await admin.firestore().collection("MemberData").get();
      snapshot1.forEach((doc) => {
        if (doc.data().email === email && doc.data().motsDepasse === password) {
          result1.push({ ...doc.data(), id: doc.id });
        }
      });

      if (result1.length > 0) {
        const token = jwt.sign({ email, password }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });

        return {
          data: result1[0],
          token,
        };
      }
    } catch (error) {
      throw new Error("La connection à échouer");
    }
  }

  static async getMemberWithEmail(email) {
    try {
      let result1 = [];
      const snapshot1 = await admin.firestore().collection("MemberData").get();
      snapshot1.forEach((doc) => {
        if (doc.data().email === email) {
          result1.push({ ...doc.data(), id: doc.id });
        }
      });
      console.log(result1);
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
    console.log("mamou");
    try {
      token = await admin2.auth().createCustomToken(uid);

      console.log(token);
      return token;
    } catch (error) {
      console.log({ error: error.message });
    }

    /*  admin2
      .auth()
      .createCustomToken(uid)
      .then((customToken) => {
        token = customToken;
      })
      .catch((error) => {
        throw new error(error.message);
      });

    console.log("toutou");

    if (token === "") {
      throw new error("server error");
    } */

    /*  
   //code avant
   const bucket = admin.storage().bucket();
    let fileUrl = "";
    console.log({ mamay: file });
    if (!file) {
      throw new Error("No file uploaded");
    }
    try {
      console.log("ciet");
      const blob = bucket.file(file.originalname);
      const blobStream = blob.createWriteStream({
        metadata: { contentType: file.mimetype },
      });
      blobStream.on("error", (error) => {
        throw new error(error.message);
      });
      blobStream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        fileUrl = publicUrl;
      });
      blobStream.end(req.file.buffer);
      return fileUrl;
    } catch (error) {
      throw new error(error.message);
    } */
  }
}

module.exports = BackofficeService;

/* 

getAuth()
  .createUser({
    email: 'user@example.com',
    emailVerified: false,
    phoneNumber: '+11234567890',
    password: 'secretPassword',
    displayName: 'John Doe',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  })
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully created new user:', userRecord.uid);
  })
  .catch((error) => {
    console.log('Error creating new user:', error);
  });


  getAuth()
  .updateUser(uid, {
    email: 'modifiedUser@example.com',
    phoneNumber: '+11234567890',
    emailVerified: true,
    password: 'newPassword',
    displayName: 'Jane Doe',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: true,
  })
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully updated user', userRecord.toJSON());
  })
  .catch((error) => {
    console.log('Error updating user:', error);
  });


  getAuth()
  .deleteUser(uid)
  .then(() => {
    console.log('Successfully deleted user');
  })
  .catch((error) => {
    console.log('Error deleting user:', error);
  });


  getAuth()
  .deleteUsers([uid1, uid2, uid3])
  .then((deleteUsersResult) => {
    console.log(`Successfully deleted ${deleteUsersResult.successCount} users`);
    console.log(`Failed to delete ${deleteUsersResult.failureCount} users`);
    deleteUsersResult.errors.forEach((err) => {
      console.log(err.error.toJSON());
    });
  })
  .catch((error) => {
    console.log('Error deleting users:', error);
  });

*/

/* ******************************************************** */

/* 
initializeApp({
  serviceAccountId: 'my-client-id@my-project-id.iam.gserviceaccount.com',
});

 //regle de stokage

 service firebase.storage {
  match /b/{bucket}/o {
    match /adminContent/{filename} {
      allow read, write: if request.auth != null && request.auth.uid == "AIzaSyBqHomX-GSUzQOf9j6g3G4HNGTlQPtySdk";
    }
  }
}


//generate token and send to client

const uid = process.env.SECRET_KEY;
getAuth()
  .createCustomToken(uid)
  .then((customToken) => {
    // Send token back to client
  })
  .catch((error) => {
    console.log('Error creating custom token:', error);
  });


//siginwithemailandpassword

import { getAuth, signInWithCustomToken } from "firebase/auth";

const auth = getAuth();
signInWithCustomToken(auth, token)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

*/
