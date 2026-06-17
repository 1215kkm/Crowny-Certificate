"use client";

import { useState, useEffect, useRef } from "react";

interface ContentProtectionOptions {
  blockCopy?: boolean;
  blockContextMenu?: boolean;
  blockKeyboard?: boolean;
  blockRecording?: boolean;
  blockDrag?: boolean;
  blockVisibilityChange?: boolean;
  blockPrintScreen?: boolean;
}

const DEFAULT_OPTIONS: ContentProtectionOptions = {
  blockCopy: true,
  blockContextMenu: true,
  blockKeyboard: true,
  blockRecording: true,
  blockDrag: true,
  blockVisibilityChange: false,
  blockPrintScreen: true,
};

export function useContentProtection(
  isActive: boolean,
  options: ContentProtectionOptions = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) return;

    function addViolation() {
      setViolations((v) => v + 1);
      setShowWarning(true);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = setTimeout(() => setShowWarning(false), 3000);
    }

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation();
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addViolation();
    };

    const preventKeyboard = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.key === "p") ||
        (e.ctrlKey && e.key === "c") ||
        (e.ctrlKey && e.key === "s") ||
        (e.ctrlKey && e.key === "a") ||
        (e.ctrlKey && e.key === "f") ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "u") ||
        e.key === "F12" ||
        (e.metaKey &&
          e.shiftKey &&
          (e.key === "3" || e.key === "4" || e.key === "5"))
      ) {
        e.preventDefault();
        addViolation();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation();
      }
    };

    const preventDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    let originalGetDisplayMedia:
      | typeof navigator.mediaDevices.getDisplayMedia
      | null = null;
    if (opts.blockRecording && navigator.mediaDevices?.getDisplayMedia) {
      originalGetDisplayMedia =
        navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async function () {
        addViolation();
        setIsRecording(true);
        throw new Error("콘텐츠 보호: 화면 녹화가 허용되지 않습니다.");
      };
    }

    async function checkScreenCapture() {
      if (!opts.blockRecording) return;
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "display-capture" as PermissionName,
        });
        if (permissionStatus.state === "granted") {
          setIsRecording(true);
          addViolation();
        }
        permissionStatus.addEventListener("change", () => {
          if (permissionStatus.state === "granted") {
            setIsRecording(true);
            addViolation();
          }
        });
      } catch {
        // display-capture permission query not supported
      }
    }
    checkScreenCapture();

    if (opts.blockCopy) {
      document.addEventListener("copy", preventCopy);
      document.addEventListener("cut", preventCopy);
    }
    if (opts.blockContextMenu) {
      document.addEventListener("contextmenu", preventContextMenu);
    }
    if (opts.blockKeyboard) {
      document.addEventListener("keydown", preventKeyboard);
    }
    if (opts.blockVisibilityChange) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    if (opts.blockDrag) {
      document.addEventListener("dragstart", preventDragStart);
    }

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventKeyboard);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("dragstart", preventDragStart);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (originalGetDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
      }
    };
  }, [isActive, opts.blockCopy, opts.blockContextMenu, opts.blockKeyboard, opts.blockRecording, opts.blockDrag, opts.blockVisibilityChange]);

  return { violations, showWarning, isRecording };
}
