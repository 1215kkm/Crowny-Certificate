import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _firestore: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase 환경변수가 설정되지 않았습니다. NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID를 확인하세요."
    );
  }
  _app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getFirebaseApp());
  return _auth;
}

export function getFirebaseFirestore(): Firestore {
  if (_firestore) return _firestore;
  _firestore = getFirestore(getFirebaseApp());
  return _firestore;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (_storage) return _storage;
  _storage = getStorage(getFirebaseApp());
  return _storage;
}

// Lazy exports for backwards compatibility
export const auth = typeof window !== "undefined" && isFirebaseConfigured() ? getFirebaseAuth() : (null as unknown as Auth);
export const firestore = typeof window !== "undefined" && isFirebaseConfigured() ? getFirebaseFirestore() : (null as unknown as Firestore);
export const storage = typeof window !== "undefined" && isFirebaseConfigured() ? getFirebaseStorage() : (null as unknown as FirebaseStorage);
export default getFirebaseApp;
