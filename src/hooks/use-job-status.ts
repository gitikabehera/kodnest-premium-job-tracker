import { useState, useCallback } from "react";

export type JobStatus = "Not Applied" | "Applied" | "Rejected" | "Selected";

export interface StatusChange {
  jobId: number;
  status: JobStatus;
  date: string; // ISO string
}

const STATUS_KEY = "jobTrackerStatus";
const CHANGES_KEY = "jobTrackerStatusChanges";

export function useJobStatus() {
  const [statuses, setStatuses] = useState<Record<number, JobStatus>>(() => {
    try {
      const stored = localStorage.getItem(STATUS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [changes, setChanges] = useState<StatusChange[]>(() => {
    try {
      const stored = localStorage.getItem(CHANGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const getStatus = useCallback(
    (jobId: number): JobStatus => statuses[jobId] ?? "Not Applied",
    [statuses]
  );

  const setStatus = useCallback(
    (jobId: number, status: JobStatus) => {
      const next = { ...statuses, [jobId]: status };
      localStorage.setItem(STATUS_KEY, JSON.stringify(next));
      setStatuses(next);

      if (status !== "Not Applied") {
        const entry: StatusChange = {
          jobId,
          status,
          date: new Date().toISOString(),
        };
        const nextChanges = [entry, ...changes].slice(0, 50);
        localStorage.setItem(CHANGES_KEY, JSON.stringify(nextChanges));
        setChanges(nextChanges);
      }
    },
    [statuses, changes]
  );

  return { getStatus, setStatus, changes };
}

export const statusColors: Record<JobStatus, string> = {
  "Not Applied": "bg-muted text-muted-foreground border-border",
  Applied: "bg-blue-600/15 text-blue-700 border-blue-600/25",
  Rejected: "bg-destructive/15 text-destructive border-destructive/25",
  Selected: "bg-green-600/15 text-green-700 border-green-600/25",
};

export const allStatuses: JobStatus[] = ["Not Applied", "Applied", "Rejected", "Selected"];
