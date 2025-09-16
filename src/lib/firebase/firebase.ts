import { initializeApp, getApp, getApps } from 'firebase/app';

const firebaseConfig = {
  "projectId": "studio-1723486232-b2a86",
  "appId": "1:32034391166:web:20f669bf1059aaef9c042f",
  "storageBucket": "studio-1723486232-b2a86.firebasestorage.app",
  "apiKey": "AIzaSyC5biTRw6Ug9Svq3CGk9M4NOZ8cu2A2qGQ",
  "authDomain": "studio-1723486232-b2a86.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "32034391166"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
