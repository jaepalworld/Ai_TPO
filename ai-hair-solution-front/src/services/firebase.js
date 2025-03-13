// Firebase 설정
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase 구성 - 실제 값으로 교체해야 합니다
const firebaseConfig = {
    apiKey: "AIzaSyB_p6wWyWEQdqV75k09ExLbAotadZnKHbk",
    authDomain: "aihairsoultion.firebaseapp.com",
    projectId: "aihairsoultion",
    storageBucket: "aihairsoultion.firebasestorage.app",
    messagingSenderId: "919216301938",
    appId: "1:919216301938:web:e2abf29aeaa85b607d5feb"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };