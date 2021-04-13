// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDM0CfvY43zRuE8mwYHZoXct3EK8NKER48",
  authDomain: "reachbukka.firebaseapp.com",
  databaseURL: "https://reachbukka.firebaseio.com",
  projectId: "reachbukka",
  storageBucket: "reachbukka.appspot.com",
  messagingSenderId: "472028973401",
  appId: "1:472028973401:web:3209c63126f0872a70e448",
  measurementId: "G-J81PPQYRYG"
};

const fire = firebase.initializeApp(firebaseConfig);

export default fire;