"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  TRACKS,
  DEFAULT_TRACK,
  DEFAULT_COURSE,
  STAGE_ORDER,
  type Course,
  type StageId,
  type TrackId,
} from "@/data/learn";
import { DEFAULT_THEME_ID } from "@/data/learn/themes";

const STORAGE_KEY = "kaiat-learn-v1";
/** 새 창 미리보기와 파일을 주고받는 채널 */
export const PREVIEW_CHANNEL = "kaiat-learn-preview";
export const PREVIEW_STORAGE_KEY = "kaiat-learn-preview-files";

interface Persisted {
  trackId: TrackId;
  courseId: string;
  stage: StageId;
  stepIndex: number;
  files: Record<string, string>;
  folders: string[];
  activeFile: string;
  /** 단계별 따라치기 완료 여부 */
  tracedStages: StageId[];
  /** 완료한 따라하기 스텝 id */
  doneSteps: string[];
  /** 완료한 배포 스텝 id */
  doneDeploy: string[];
  /** 화면 테마 id — 상단 셀렉트로 바꾼다 */
  themeId: string;
}

interface LearnState extends Persisted {
  course: Course | undefined;
  setTrack: (id: TrackId) => void;
  setCourse: (id: string) => void;
  setStage: (s: StageId) => void;
  setStepIndex: (i: number) => void;
  setActiveFile: (path: string) => void;
  writeFile: (path: string, code: string) => void;
  createFile: (path: string) => void;
  createFolder: (path: string) => void;
  deleteFile: (path: string) => void;
  markTraced: (s: StageId) => void;
  toggleStepDone: (id: string) => void;
  toggleDeployDone: (id: string) => void;
  setThemeId: (id: string) => void;
  resetCourse: () => void;
  /** 저장된 진도가 있어 이어서 하는 중인가 */
  hydrated: boolean;
}

const LearnContext = createContext<LearnState | null>(null);

function findCourse(trackId: TrackId, courseId: string): Course | undefined {
  return TRACKS.find((t) => t.id === trackId)?.courses.find(
    (c) => c.id === courseId
  );
}

function initialState(): Persisted {
  const course = findCourse(DEFAULT_TRACK, DEFAULT_COURSE);
  return {
    trackId: DEFAULT_TRACK,
    courseId: DEFAULT_COURSE,
    stage: "topic",
    stepIndex: 0,
    files: { ...(course?.starterFiles ?? {}) },
    folders: [],
    activeFile: "/App.js",
    tracedStages: [],
    doneSteps: [],
    doneDeploy: [],
    themeId: DEFAULT_THEME_ID,
  };
}

export function LearnProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(initialState);
  const [hydrated, setHydrated] = useState(false);

  /* 저장된 진도 불러오기 */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Persisted>;
        setState((prev) => ({ ...prev, ...saved }));
      }
    } catch {
      /* 저장본이 깨졌으면 그냥 처음부터 */
    }
    setHydrated(true);
  }, []);

  /* 진도 저장 — 로그인 없이 쓰므로 브라우저에만 남긴다 */
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* 용량 초과 등은 무시 — 학습이 끊기면 안 되니까 */
    }
  }, [state, hydrated]);

  /* 새 창 미리보기에 파일 전달 */
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        PREVIEW_STORAGE_KEY,
        JSON.stringify(state.files)
      );
      if (typeof BroadcastChannel !== "undefined") {
        const ch = new BroadcastChannel(PREVIEW_CHANNEL);
        ch.postMessage({ type: "files", files: state.files });
        ch.close();
      }
    } catch {
      /* 무시 */
    }
  }, [state.files, hydrated]);

  const course = useMemo(
    () => findCourse(state.trackId, state.courseId),
    [state.trackId, state.courseId]
  );

  const setTrack = useCallback((id: TrackId) => {
    setState((prev) => {
      const track = TRACKS.find((t) => t.id === id);
      const first = track?.courses[0];
      if (!first) return { ...prev, trackId: id };
      return {
        ...prev,
        trackId: id,
        courseId: first.id,
        stage: "topic",
        stepIndex: 0,
        files: { ...first.starterFiles },
        folders: [],
        activeFile: Object.keys(first.starterFiles)[0] ?? "/App.js",
        tracedStages: [],
        doneSteps: [],
        doneDeploy: [],
      };
    });
  }, []);

  const setCourse = useCallback((id: string) => {
    setState((prev) => {
      const next = findCourse(prev.trackId, id);
      if (!next) return prev;
      return {
        ...prev,
        courseId: id,
        stage: "topic",
        stepIndex: 0,
        files: { ...next.starterFiles },
        folders: [],
        activeFile: "/App.js",
        tracedStages: [],
        doneSteps: [],
        doneDeploy: [],
      };
    });
  }, []);

  const setStage = useCallback((s: StageId) => {
    setState((prev) => ({ ...prev, stage: s }));
  }, []);

  const setStepIndex = useCallback((i: number) => {
    setState((prev) => ({ ...prev, stepIndex: Math.max(0, i) }));
  }, []);

  const setActiveFile = useCallback((path: string) => {
    setState((prev) => ({ ...prev, activeFile: path }));
  }, []);

  const writeFile = useCallback((path: string, code: string) => {
    setState((prev) => ({ ...prev, files: { ...prev.files, [path]: code } }));
  }, []);

  const createFile = useCallback((path: string) => {
    setState((prev) => {
      if (prev.files[path] !== undefined) return { ...prev, activeFile: path };
      return {
        ...prev,
        files: { ...prev.files, [path]: "" },
        activeFile: path,
      };
    });
  }, []);

  const createFolder = useCallback((path: string) => {
    setState((prev) =>
      prev.folders.includes(path)
        ? prev
        : { ...prev, folders: [...prev.folders, path] }
    );
  }, []);

  const deleteFile = useCallback((path: string) => {
    setState((prev) => {
      const next = { ...prev.files };
      delete next[path];
      const remaining = Object.keys(next);
      return {
        ...prev,
        files: next,
        activeFile:
          prev.activeFile === path ? remaining[0] ?? "" : prev.activeFile,
      };
    });
  }, []);

  const markTraced = useCallback((s: StageId) => {
    setState((prev) =>
      prev.tracedStages.includes(s)
        ? prev
        : { ...prev, tracedStages: [...prev.tracedStages, s] }
    );
  }, []);

  const toggleStepDone = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      doneSteps: prev.doneSteps.includes(id)
        ? prev.doneSteps.filter((s) => s !== id)
        : [...prev.doneSteps, id],
    }));
  }, []);

  const toggleDeployDone = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      doneDeploy: prev.doneDeploy.includes(id)
        ? prev.doneDeploy.filter((s) => s !== id)
        : [...prev.doneDeploy, id],
    }));
  }, []);

  const setThemeId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, themeId: id }));
  }, []);

  const resetCourse = useCallback(() => {
    setState((prev) => {
      const c = findCourse(prev.trackId, prev.courseId);
      return {
        ...prev,
        stage: "topic",
        stepIndex: 0,
        files: { ...(c?.starterFiles ?? {}) },
        folders: [],
        activeFile: "/App.js",
        tracedStages: [],
        doneSteps: [],
        doneDeploy: [],
      };
    });
  }, []);

  const value: LearnState = {
    ...state,
    course,
    hydrated,
    setTrack,
    setCourse,
    setStage,
    setStepIndex,
    setActiveFile,
    writeFile,
    createFile,
    createFolder,
    deleteFile,
    markTraced,
    toggleStepDone,
    toggleDeployDone,
    setThemeId,
    resetCourse,
  };

  return (
    <LearnContext.Provider value={value}>{children}</LearnContext.Provider>
  );
}

export function useLearn(): LearnState {
  const ctx = useContext(LearnContext);
  if (!ctx) throw new Error("useLearn 은 LearnProvider 안에서만 쓸 수 있어요.");
  return ctx;
}

/** 진행률 — 목차 7단계 기준 */
export function useProgress() {
  const { course, tracedStages, doneSteps, doneDeploy } = useLearn();
  if (!course) return { percent: 0, label: "0%" };

  const totalSteps = course.buildSteps.length;
  const totalDeploy = course.deploySteps.length;
  // 1~5단계 따라치기 5칸 + 따라하기 스텝 + 배포 스텝
  const total = 5 + totalSteps + totalDeploy;
  const done =
    tracedStages.filter((s) => STAGE_ORDER.indexOf(s) < 5).length +
    doneSteps.length +
    doneDeploy.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { percent, label: `${percent}%` };
}
