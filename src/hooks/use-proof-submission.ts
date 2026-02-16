import { useState, useCallback, useMemo } from "react";
import { useTestChecklist } from "./use-test-checklist";

const STORAGE_KEY = "jobTrackerProofLinks";

export interface ProofLinks {
  lovableLink: string;
  githubLink: string;
  deployedLink: string;
}

const defaultLinks: ProofLinks = {
  lovableLink: "",
  githubLink: "",
  deployedLink: "",
};

export type ShipStatus = "Not Started" | "In Progress" | "Shipped";

const URL_REGEX = /^https?:\/\/.+\..+/;

export function isValidUrl(url: string): boolean {
  return URL_REGEX.test(url.trim());
}

export function useProofSubmission() {
  const [links, setLinks] = useState<ProofLinks>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultLinks, ...JSON.parse(stored) } : defaultLinks;
    } catch {
      return defaultLinks;
    }
  });

  const { allPassed } = useTestChecklist();

  const saveLinks = useCallback((next: ProofLinks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setLinks(next);
  }, []);

  const updateField = useCallback(
    (field: keyof ProofLinks, value: string) => {
      const next = { ...links, [field]: value };
      saveLinks(next);
    },
    [links, saveLinks]
  );

  const allLinksValid = useMemo(
    () =>
      isValidUrl(links.lovableLink) &&
      isValidUrl(links.githubLink) &&
      isValidUrl(links.deployedLink),
    [links]
  );

  const shipStatus: ShipStatus = useMemo(() => {
    if (allLinksValid && allPassed) return "Shipped";
    if (links.lovableLink || links.githubLink || links.deployedLink) return "In Progress";
    return "Not Started";
  }, [allLinksValid, allPassed, links]);

  const submissionText = useMemo(() => {
    return `Job Notification Tracker — Final Submission

Lovable Project:
${links.lovableLink || "(not provided)"}

GitHub Repository:
${links.githubLink || "(not provided)"}

Live Deployment:
${links.deployedLink || "(not provided)"}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced`;
  }, [links]);

  return { links, updateField, allLinksValid, allPassed, shipStatus, submissionText };
}
