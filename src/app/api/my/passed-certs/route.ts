import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

/**
 * 로그인 사용자가 "합격"한 자격증 종류 ID 목록.
 * 등급별 합격 조건:
 *   3급(GRADE_3): 필기 합격
 *   2급(GRADE_2): 필기 합격 + 실기(랜딩페이지) 합격 (발표일 경과)
 *   1급(GRADE_1): 필기 합격 + 앱 실기 합격
 *   특급(SPECIAL): 제품 챌린지 합격 (발표일 경과)
 * GET /api/my/passed-certs  →  { passed: string[] }
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ passed: [] });
    }
    const decoded = await adminAuth.verifyIdToken(authHeader.split("Bearer ")[1]);
    const uid = decoded.uid;
    const now = Date.now();

    const toMs = (v: unknown): number => {
      if (!v) return 0;
      const t = v as { toDate?: () => Date };
      if (typeof t.toDate === "function") return t.toDate().getTime();
      const d = new Date(v as string);
      return isNaN(d.getTime()) ? 0 : d.getTime();
    };

    const [certTypesSnap, examsSnap, writtenSnap, practSnap, appSnap, specialSnap] =
      await Promise.all([
        adminDb.collection("certificateTypes").get(),
        adminDb.collection("exams").get(),
        adminDb.collection("examSubmissions").where("userId", "==", uid).where("passed", "==", true).get(),
        adminDb.collection("practicalSubmissions").where("userId", "==", uid).where("passed", "==", true).get(),
        adminDb.collection("appSubmissions").where("userId", "==", uid).where("passed", "==", true).get(),
        adminDb.collection("specialSubmissions").where("userId", "==", uid).where("passed", "==", true).get(),
      ]);

    // examId → certificateTypeId
    const examToCert: Record<string, string> = {};
    examsSnap.forEach((d) => { examToCert[d.id] = d.data().certificateTypeId; });

    // 필기 합격 certTypeId 집합
    const writtenPassed = new Set<string>();
    writtenSnap.forEach((d) => {
      const cid = examToCert[d.data().examId];
      if (cid) writtenPassed.add(cid);
    });

    // 실기 합격 집합 (발표일 경과한 것만)
    const practicalPassed = new Set<string>();
    practSnap.forEach((d) => {
      const data = d.data();
      if (data.status === "GRADED" && now >= toMs(data.announceAt)) {
        if (data.certificateTypeId) practicalPassed.add(data.certificateTypeId);
      }
    });
    const appPassed = new Set<string>();
    appSnap.forEach((d) => {
      const data = d.data();
      if (data.status === "GRADED" && data.certificateTypeId) appPassed.add(data.certificateTypeId);
    });
    const specialPassed = new Set<string>();
    specialSnap.forEach((d) => {
      const data = d.data();
      if (data.status === "GRADED" && now >= toMs(data.announceAt)) {
        if (data.certificateTypeId) specialPassed.add(data.certificateTypeId);
      }
    });

    const passed: string[] = [];
    certTypesSnap.forEach((d) => {
      const grade = d.data().grade;
      const id = d.id;
      let ok = false;
      if (grade === "GRADE_3") ok = writtenPassed.has(id);
      else if (grade === "GRADE_2") ok = writtenPassed.has(id) && practicalPassed.has(id);
      else if (grade === "GRADE_1") ok = writtenPassed.has(id) && appPassed.has(id);
      else if (grade === "SPECIAL") ok = specialPassed.has(id);
      if (ok) passed.push(id);
    });

    return NextResponse.json({ passed });
  } catch (e) {
    console.error("passed-certs error:", e);
    return NextResponse.json({ passed: [] });
  }
}
