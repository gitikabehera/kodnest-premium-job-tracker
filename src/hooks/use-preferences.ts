import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "jobTrackerPreferences";

export interface Preferences {
  roleKeywords: string;
  preferredLocations: string[];
  preferredMode: string[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
}

export const defaultPreferences: Preferences = {
  roleKeywords: "",
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "",
  skills: "",
  minMatchScore: 40,
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  const [hasPreferences, setHasPreferences] = useState(() => {
    return !!localStorage.getItem(STORAGE_KEY);
  });

  const save = useCallback((prefs: Preferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setHasPreferences(true);
  }, []);

  return { preferences, hasPreferences, save };
}
