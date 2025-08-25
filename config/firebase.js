 
/*const dotenv = require('dotenv');
const firebase = require('firebase/app');
require('firebase/storage'); // important pour pouvoir utiliser le storage

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const fire_bd = firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

module.exports = { fire_bd, storage };*/




const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "firebase-service-account.json")); 
// Téléchargé depuis Firebase Console > Settings > Service accounts

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET, // ex: "mon-projet.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };
