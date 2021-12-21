// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase} from "firebase/database";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqua62B9jQDGFjOpG72QXuYRnbq8LH3h8",
  authDomain: "meme-3d972.firebaseapp.com",
  projectId: "meme-3d972",
  storageBucket: "meme-3d972.appspot.com",
  messagingSenderId: "880602581410",
  appId: "1:880602581410:web:b45aea636d0c8b48400afb",
  measurementId: "G-7143ZSPT9S",
//   databaseURL: "https://meme-3d972-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase

// const analytics = getAnalytics(app);

export const app = initializeApp(firebaseConfig);
