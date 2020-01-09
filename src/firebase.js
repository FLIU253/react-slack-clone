import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDwNjyQHrsd-aws-yBz0w23rqGixCvsPMQ",
  authDomain: "react-slack-clone-5239b.firebaseapp.com",
  databaseURL: "https://react-slack-clone-5239b.firebaseio.com",
  projectId: "react-slack-clone-5239b",
  storageBucket: "react-slack-clone-5239b.appspot.com",
  messagingSenderId: "420055061478",
  appId: "1:420055061478:web:70c0391574dd37d40efc27",
  measurementId: "G-Q1FJQDB12E"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
