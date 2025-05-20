// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 환경 변수에서 Firebase 구성 정보 가져오기
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyB_p6wWyWEQdqV75k09ExLbAotadZnKHbk",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "aihairsoultion.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "aihairsoultion",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "aihairsoultion.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "919216301938",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:919216301938:web:e2abf29aeaa85b607d5feb"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 초기화된 후에 auth와 db 생성
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;