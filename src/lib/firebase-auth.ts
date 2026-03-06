import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";
import { setDocument, Timestamp } from "./firestore";
import type { UserDoc, UserRole } from "./firestore";

// 이메일/비밀번호 회원가입
export async function registerWithEmail(
  email: string,
  password: string,
  name: string,
  phone?: string
): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(credential.user, { displayName: name });

  const userData: UserDoc = {
    email,
    name,
    phone: phone || null,
    address: null,
    role: "STUDENT",
    image: null,
    emailVerified: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await setDocument("users", credential.user.uid, userData);

  return credential;
}

// 이메일/비밀번호 로그인
export async function loginWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

// Google 로그인
export async function loginWithGoogle(): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);

  const { getDocument } = await import("./firestore");
  const existingUser = await getDocument<UserDoc>("users", credential.user.uid);

  if (!existingUser) {
    const userData: UserDoc = {
      email: credential.user.email || "",
      name: credential.user.displayName || null,
      phone: credential.user.phoneNumber || null,
      address: null,
      role: "STUDENT",
      image: credential.user.photoURL || null,
      emailVerified: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await setDocument("users", credential.user.uid, userData);
  }

  return credential;
}

// 로그아웃
export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  return firebaseSignOut(auth);
}

// 현재 사용자의 ID 토큰 가져오기 (서버 API 요청용)
export async function getIdToken(): Promise<string | null> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

// 사용자 역할 확인
export async function getUserRole(uid: string): Promise<UserRole> {
  const { getDocument } = await import("./firestore");
  const user = await getDocument<UserDoc>("users", uid);
  return user?.role || "STUDENT";
}
