import "dotenv/config"
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: "api-rest-node-js-data-fbb8e",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "387091234005",
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

export {db}