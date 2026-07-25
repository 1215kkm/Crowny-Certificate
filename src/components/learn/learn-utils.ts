import type { BuildStep, Course, Paragraph } from "@/data/learn";

/**
 * 선생이 stepIndex 스텝까지 만들었을 때의 파일 상태.
 * 각 스텝의 files[].code 는 "그 스텝이 끝났을 때의 파일 전체 내용" 이므로
 * 앞에서부터 덮어쓰면 그대로 누적본이 된다.
 */
export function teacherFilesUpTo(
  course: Course,
  stepIndex: number
): Record<string, string> {
  const files: Record<string, string> = { ...course.starterFiles };
  course.buildSteps.slice(0, stepIndex + 1).forEach((step) => {
    step.files.forEach((f) => {
      files[f.path] = f.code;
    });
  });
  return files;
}

/** 선생이 지금까지 만든 폴더 */
export function teacherFoldersUpTo(course: Course, stepIndex: number): string[] {
  const folders = new Set<string>();
  course.buildSteps.slice(0, stepIndex + 1).forEach((step) => {
    step.createFolders?.forEach((f) => folders.add(f));
  });
  return [...folders];
}

/** 따라하기 스텝의 설명을 타이핑용 단락으로 바꾼다 */
export function buildStepParagraphs(step: BuildStep): Paragraph[] {
  return [
    { kind: "goal", text: step.goal },
    { kind: "why", text: step.why },
    { kind: "what", text: step.what },
    { kind: "where", text: step.where },
    // 결과 — 이 스텝으로 우리가 뭘 한 건지 (있을 때만)
    ...(step.result
      ? [{ kind: "result" as const, text: step.result }]
      : []),
    { kind: "next", text: step.next },
  ];
}

/** "/pages/AboutPage.js" → "AboutPage.js" */
export function baseName(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] || path;
}

/** "/pages/AboutPage.js" → "/pages" (루트면 "") */
export function dirName(path: string): string {
  const i = path.lastIndexOf("/");
  return i <= 0 ? "" : path.slice(0, i);
}

/** 파일 목록을 폴더별로 묶는다 — 트리 표시용 */
export function groupByFolder(
  paths: string[],
  extraFolders: string[] = []
): { folder: string; files: string[] }[] {
  const map = new Map<string, string[]>();
  extraFolders.forEach((f) => map.set(f, []));
  paths.forEach((p) => {
    const dir = dirName(p);
    if (!map.has(dir)) map.set(dir, []);
    map.get(dir)!.push(p);
  });
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([folder, files]) => ({ folder, files: files.sort() }));
}

/**
 * 학생 파일이 선생 정답과 같은지.
 *
 * "옮겨 적었나"만 본다 — 들여쓰기·줄 안쪽 공백, 따옴표 종류(' " `),
 * 세미콜론 유무는 전부 봐준다. 예: `<AboutPage />` 와 `<AboutPage/>`,
 * `'app'` 과 `"app"` 는 같은 것으로 친다. 사소한 차이로 다음 버튼이 안 켜지면
 * 다 해놓고도 막힌 것처럼 느껴지기 때문.
 */
export function codeMatches(mine: string, answer: string): boolean {
  const norm = (s: string) =>
    s
      .replace(/['`]/g, '"') // 따옴표 종류 통일
      .replace(/;/g, "") // 세미콜론 무시
      .replace(/\s+/g, ""); // 모든 공백·줄바꿈 무시
  return norm(mine) === norm(answer);
}
