import type { Track, TrackId, Course } from "./types";
import { reactTodoCourse } from "./courses/react-todo";
import { reactMoodCourse } from "./courses/react-mood";
import { reactShopCourse } from "./courses/react-shop";
import { htmlProfileCourse } from "./courses/html-profile";
import { htmlTimetableCourse } from "./courses/html-timetable";
import { jqueryGreetCourse } from "./courses/jquery-greet";
import { jqueryFaqCourse } from "./courses/jquery-faq";
import { jsCounterCourse } from "./courses/js-counter";
import { jsRpsCourse } from "./courses/js-rps";

export * from "./types";

/**
 * 상단 언어 탭.
 * 콘텐츠가 준비된 트랙만 ready: true. 나머지는 "준비 중" 뱃지가 붙고 눌러도 안내만 뜬다.
 * 새 코스를 추가할 때는 courses/ 아래에 파일을 만들고 여기 배열에만 끼워 넣으면 된다.
 */
export const TRACKS: Track[] = [
  {
    id: "html",
    label: "HTML",
    tagline: "웹의 뼈대",
    ready: true,
    courses: [htmlProfileCourse, htmlTimetableCourse],
  },
  {
    id: "jquery",
    label: "jQuery",
    tagline: "짧게 쓰는 JS",
    ready: true,
    courses: [jqueryGreetCourse, jqueryFaqCourse],
  },
  {
    id: "javascript",
    label: "JavaScript",
    tagline: "웹을 움직이게",
    ready: true,
    courses: [jsCounterCourse, jsRpsCourse],
  },
  {
    id: "react",
    label: "React",
    tagline: "화면을 부품으로",
    ready: true,
    courses: [reactTodoCourse, reactMoodCourse, reactShopCourse],
  },
];

export function getTrack(id: TrackId): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}

export function getCourse(trackId: TrackId, courseId: string): Course | undefined {
  return getTrack(trackId)?.courses.find((c) => c.id === courseId);
}

/** 기본 진입값 — React / 할 일 앱 */
export const DEFAULT_TRACK: TrackId = "react";
export const DEFAULT_COURSE = "react-todo";
