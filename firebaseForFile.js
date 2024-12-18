var admin2 = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config();
//var serviceAccount = require("./firebaseAdminSDK.json");

const secondaryApp = admin2.initializeApp(
  {
    credential: admin2.credential.cert(
      /* serviceAccount */
      {
        type: process.env.FIREBASE_TYPE2,
        project_id: process.env.FIREBASE_PROJECT_ID2,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID2,
        private_key: process.env.FIREBASE_PRIVATE_KEY2,
        client_email: process.env.FIREBASE_CLIENT_EMAIL2,
        client_id: process.env.FIREBASE_CLIENT_ID2,
        auth_uri: process.env.FIREBASE_AUTH_URI2,
        token_uri: process.env.FIREBASE_TOKEN_URI2,
        auth_provider_x509_cert_url:
          process.env.FIREBASE_AUTH_PROVIDER_CERT_URL2,
        client_x509_cert_url: process.env.FIREBASE_CERT_URL2,
        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN2,
      }
    ),
  },
  "secondaryApp"
);

module.exports = { secondaryApp, admin2 };
