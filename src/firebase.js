// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Optionally import analytics if you need it
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTQ9ufeXxQFhzWSZvstAEEvLGHcCSdAMA",
  authDomain: "brokr-login.firebaseapp.com",
  projectId: "brokr-login",
  storageBucket: "brokr-login.appspot.com",
  messagingSenderId: "192209516754",
  appId: "1:192209516754:web:abbe0686fa44c6f515150b",
  measurementId: "G-X1JHGM9B1Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app); // Uncomment if using analytics

// Export the initialized instances
export { app, auth };
