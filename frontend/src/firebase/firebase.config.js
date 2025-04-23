import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebase = {
    apiKey: "AIzaSyCRXGhC4zZjbswTBjYQ6hvMlUshMgpEBhQ",
    authDomain: "login-auth-49d40.firebaseapp.com",
    projectId: "login-auth-49d40",
    storageBucket: "login-auth-49d40.firebasestorage.app",
    messagingSenderId: "1037786411658",
    appId: "1:1037786411658:web:3d1007fdd7bfe406fdf373"
};

const app = initializeApp(firebase);
const auth = getAuth();
const db = getFirestore(app);
export { app, auth, RecaptchaVerifier, signInWithPhoneNumber, db };



export const addUser = async (user) => {
    try {
        await addDoc(collection(db, "users"), user);
        console.log("User added successfully");
    } catch (error) {
        console.error("Error adding user:", error);
    }
};