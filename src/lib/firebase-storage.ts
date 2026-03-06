import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { storage } from "./firebase";

// 파일 업로드 (일반)
export async function uploadFile(
  path: string,
  file: File | Blob
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// 파일 업로드 (진행률 추적 가능)
export function uploadFileWithProgress(
  path: string,
  file: File | Blob
): UploadTask {
  const storageRef = ref(storage, path);
  return uploadBytesResumable(storageRef, file);
}

// 파일 URL 가져오기
export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

// 파일 삭제
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

// 인증서 PDF 업로드 경로 생성
export function getCertificatePdfPath(
  userId: string,
  issueNumber: string
): string {
  return `certificates/${userId}/${issueNumber}.pdf`;
}

// 시험 답안 파일 업로드 경로 생성
export function getExamAnswerFilePath(
  submissionId: string,
  questionId: string,
  fileName: string
): string {
  return `exam-answers/${submissionId}/${questionId}/${fileName}`;
}
