import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { getFirebaseFirestore } from "./firebase";

// ==================== 타입 정의 ====================

export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";
export type CertificateGrade = "GRADE_3" | "GRADE_2" | "GRADE_1" | "SPECIAL";
export type ExamFormat = "MULTIPLE_CHOICE" | "PRACTICAL" | "PROJECT" | "CHALLENGE";
export type QuestionType = "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "ESSAY" | "FILE_UPLOAD";
export type PaymentType = "COURSE" | "EXAM" | "CERTIFICATE";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED";
export type DeliveryMethod = "EMAIL" | "MAIL" | "BOTH";
export type IssuanceStatus = "PENDING" | "GENERATING" | "ISSUED" | "MAILING" | "DELIVERED";
export type SubmissionStatus = "IN_PROGRESS" | "SUBMITTED" | "GRADING" | "GRADED";

export interface UserDoc {
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  role: UserRole;
  image: string | null;
  emailVerified: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CertificateTypeDoc {
  name: string;
  grade: CertificateGrade;
  description: string;
  examFormat: ExamFormat;
  price: number;
  coursePrice: number;
  certPrice: number;
  passingScore: number;
  duration: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CourseDoc {
  title: string;
  description: string;
  thumbnailUrl: string | null;
  certificateTypeId: string;
  totalDuration: number;
  lessonCount: number;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LessonDoc {
  courseId: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number;
  order: number;
  isFree: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EnrollmentDoc {
  userId: string;
  courseId: string;
  progress: number;
  completedAt: Timestamp | null;
  paymentId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LessonProgressDoc {
  enrollmentId: string;
  lessonId: string;
  completed: boolean;
  watchedSec: number;
  completedAt: Timestamp | null;
}

export interface ExamDoc {
  certificateTypeId: string;
  title: string;
  description: string | null;
  scheduledDate: Timestamp | null;
  registrationStart: Timestamp | null;
  registrationEnd: Timestamp | null;
  duration: number;
  questionCount: number;
  maxAttempts: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ExamQuestionDoc {
  examId: string;
  type: QuestionType;
  content: string;
  options: string[];
  correctAnswer: string | null;
  points: number;
  order: number;
  explanation: string | null;
  createdAt: Timestamp;
}

export interface ExamSubmissionDoc {
  userId: string;
  examId: string;
  status: SubmissionStatus;
  score: number | null;
  totalPoints: number | null;
  passed: boolean | null;
  startedAt: Timestamp;
  submittedAt: Timestamp | null;
  gradedAt: Timestamp | null;
  gradedBy: string | null;
  paymentId: string | null;
  feedback: string | null;
}

export interface SubmissionAnswerDoc {
  submissionId: string;
  questionId: string;
  answer: string;
  fileUrl: string | null;
  points: number | null;
  isCorrect: boolean | null;
}

export interface PaymentDoc {
  userId: string;
  type: PaymentType;
  amount: number;
  method: string | null;
  status: PaymentStatus;
  tossOrderId: string | null;
  tossPaymentKey: string | null;
  receiptUrl: string | null;
  refundedAt: Timestamp | null;
  refundReason: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CertificateIssuanceDoc {
  userId: string;
  certificateTypeId: string;
  issueNumber: string;
  issuedAt: Timestamp | null;
  deliveryMethod: DeliveryMethod;
  pdfUrl: string | null;
  mailingAddress: string | null;
  mailingZipCode: string | null;
  recipientName: string | null;
  recipientPhone: string | null;
  trackingNumber: string | null;
  status: IssuanceStatus;
  paymentId: string | null;
  qrCodeUrl: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== 컬렉션 참조 ====================

function db() {
  return getFirebaseFirestore();
}

export function getCollection(name: string) {
  return collection(db(), name);
}

export const collections = {
  get users() { return collection(db(), "users"); },
  get certificateTypes() { return collection(db(), "certificateTypes"); },
  get courses() { return collection(db(), "courses"); },
  get enrollments() { return collection(db(), "enrollments"); },
  get exams() { return collection(db(), "exams"); },
  get examSubmissions() { return collection(db(), "examSubmissions"); },
  get payments() { return collection(db(), "payments"); },
  get certificateIssuances() { return collection(db(), "certificateIssuances"); },
};

// 서브컬렉션 참조
export function lessonsCollection(courseId: string) {
  return collection(db(), "courses", courseId, "lessons");
}

export function lessonProgressesCollection(enrollmentId: string) {
  return collection(db(), "enrollments", enrollmentId, "lessonProgresses");
}

export function questionsCollection(examId: string) {
  return collection(db(), "exams", examId, "questions");
}

export function answersCollection(submissionId: string) {
  return collection(db(), "examSubmissions", submissionId, "answers");
}

// ==================== CRUD 헬퍼 ====================

export async function getDocument<T>(collectionName: string, docId: string): Promise<(T & { id: string }) | null> {
  const docRef = doc(db(), collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...(docSnap.data() as T) };
}

export async function getDocuments<T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<(T & { id: string })[]> {
  const q = query(collection(db(), collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export async function createDocument<T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> {
  const docRef = await addDoc(collection(db(), collectionName), data);
  return docRef.id;
}

export async function setDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  await setDoc(doc(db(), collectionName, docId), data);
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> {
  await updateDoc(doc(db(), collectionName, docId), data);
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  await deleteDoc(doc(db(), collectionName, docId));
}

// Re-export commonly used Firestore functions
export { where, orderBy, limit, Timestamp, query, doc, getDoc, getDocs, addDoc, setDoc, collection };
