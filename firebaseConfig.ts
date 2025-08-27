import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCcRJX74VEfHwh4eQ2YjXoncMT9XXk5Ztk",
  authDomain: "service-provider-auth-4c109.firebaseapp.com",
  projectId: "service-provider-auth-4c109",
  storageBucket: "service-provider-auth-4c109.firebasestorage.app",
  messagingSenderId: "992692266119",
  appId: "1:992692266119:web:56d3fba53a6552a61e8422",
  measurementId: "G-7WP112BYFE",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
