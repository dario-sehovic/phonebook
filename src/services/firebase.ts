// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAQas8_FBBqPRWfQQEBHrWvXBXn9kQiG6w',
  authDomain: 'darios-phonebook.firebaseapp.com',
  projectId: 'darios-phonebook',
  storageBucket: 'darios-phonebook.appspot.com',
  messagingSenderId: '565121189224',
  appId: '1:565121189224:web:b3eebe7613fa5cb7edc2dd',
  measurementId: 'G-N55DPJ9B28',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export default app;

export {
  analytics,
  db,
  auth,
};
