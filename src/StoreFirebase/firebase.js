import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDHJ9Gw-s_FKswSJOZfEX78u3TERggLKyw",
    authDomain: "pr11-firebase.firebaseapp.com",
    databaseURL: "https://pr11-firebase-default-rtdb.firebaseio.com",
    projectId: "pr11-firebase",
    storageBucket: "pr11-firebase.appspot.com",
    messagingSenderId: "109215112022",
    appId: "1:109215112022:web:1081ec8fa14e60964814f7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
