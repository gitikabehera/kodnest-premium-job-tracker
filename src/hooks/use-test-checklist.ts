import { useState, useCallback } from "react";

const STORAGE_KEY = "jobTrackerTestChecklist";

export interface TestItem {
  id: string;
  label: string;
  howToTest: string;
}

export const testItems: TestItem[] = [
  { id: "prefs-persist", label: "Preferences persist after refresh", howToTest: "Save preferences in Settings, refresh the page, and verify they're still there." },
  { id: "match-score", label: "Match score calculates correctly", howToTest: "Set preferences with known keywords, check Dashboard for expected score badges." },
  { id: "match-toggle", label: "\"Show only matches\" toggle works", howToTest: "Enable the toggle on Dashboard and verify only jobs above your threshold appear." },
  { id: "save-persist", label: "Save job persists after refresh", howToTest: "Save a job, refresh the page, and confirm it still appears in Saved." },
  { id: "apply-tab", label: "Apply opens in new tab", howToTest: "Click the Apply button on a job card and verify it opens in a new browser tab." },
  { id: "status-persist", label: "Status update persists after refresh", howToTest: "Change a job's status, refresh, and confirm the status badge remains." },
  { id: "status-filter", label: "Status filter works correctly", howToTest: "Change a job to 'Applied', then filter by 'Applied' on Dashboard." },
  { id: "digest-top10", label: "Digest generates top 10 by score", howToTest: "Generate a digest and verify it lists up to 10 jobs ordered by match score." },
  { id: "digest-persist", label: "Digest persists for the day", howToTest: "Generate a digest, refresh, and confirm the same digest loads automatically." },
  { id: "no-errors", label: "No console errors on main pages", howToTest: "Open browser DevTools, visit each page, and check for red errors in the console." },
];

export function useTestChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setChecked({});
  }, []);

  const passedCount = testItems.filter((t) => checked[t.id]).length;
  const allPassed = passedCount === testItems.length;

  return { checked, toggle, reset, passedCount, allPassed };
}
