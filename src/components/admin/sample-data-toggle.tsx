"use client";

import { useEffect, useState } from "react";
import { getDocument, setDocument } from "@/lib/firestore";

interface SiteSettings {
  showSampleData: boolean;
}

export function useSampleDataSetting() {
  const [showSample, setShowSample] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const settings = await getDocument<SiteSettings>("settings", "site");
        setShowSample(settings?.showSampleData ?? false);
      } catch {
        // settings가 없으면 기본값 false
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { showSample, loading };
}

interface Props {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function SampleDataToggle({ enabled, onChange }: Props) {
  const [saving, setSaving] = useState(false);

  const handleChange = async (checked: boolean) => {
    // 먼저 UI 업데이트 (낙관적)
    onChange(checked);
    setSaving(true);
    try {
      await setDocument("settings", "site", { showSampleData: checked });
    } catch (error) {
      console.error("설정 저장 실패:", error);
      // Firestore 저장 실패 시 로컬 상태라도 유지
      // (보안 규칙으로 인해 실패할 수 있음)
    } finally {
      setSaving(false);
    }
  };

  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => handleChange(e.target.checked)}
        disabled={saving}
        className="rounded"
      />
      <span className={saving ? "text-muted-foreground" : ""}>
        샘플 데이터 표시 (사용자 페이지에 표시됨)
      </span>
    </label>
  );
}
