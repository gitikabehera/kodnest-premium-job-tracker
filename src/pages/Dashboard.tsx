import { useState, useMemo } from "react";
import { jobs, type Job } from "@/data/jobs";
import { useSavedJobs } from "@/hooks/use-saved-jobs";
import { usePreferences } from "@/hooks/use-preferences";
import { useJobStatus, type JobStatus } from "@/hooks/use-job-status";
import { computeMatchScore } from "@/lib/match-score";
import FilterBar, { type Filters } from "@/components/FilterBar";
import JobCard from "@/components/JobCard";
import JobDetailModal from "@/components/JobDetailModal";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const defaultFilters: Filters = {
  keyword: "",
  location: "All",
  mode: "All",
  experience: "All",
  source: "All",
  sort: "Latest",
  status: "All",
};

const Dashboard = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [onlyMatches, setOnlyMatches] = useState(false);
  const { toggleSave, isSaved } = useSavedJobs();
  const { preferences, hasPreferences } = usePreferences();
  const { getStatus, setStatus: setJobStatus } = useJobStatus();

  const handleStatusChange = (id: number, status: JobStatus) => {
    setJobStatus(id, status);
    if (status !== "Not Applied") {
      toast.success(`Status updated: ${status}`);
    }
  };

  const scored = useMemo(() => {
    return jobs.map((job) => ({
      ...job,
      matchScore: hasPreferences ? computeMatchScore(job, preferences) : 0,
    }));
  }, [preferences, hasPreferences]);

  const filtered = useMemo(() => {
    let list = [...scored];

    if (onlyMatches && hasPreferences) {
      list = list.filter((j) => j.matchScore >= preferences.minMatchScore);
    }

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw)
      );
    }
    if (filters.location !== "All")
      list = list.filter((j) => j.location === filters.location);
    if (filters.mode !== "All")
      list = list.filter((j) => j.mode === filters.mode);
    if (filters.experience !== "All")
      list = list.filter((j) => j.experience === filters.experience);
    if (filters.source !== "All")
      list = list.filter((j) => j.source === filters.source);
    if (filters.status !== "All")
      list = list.filter((j) => getStatus(j.id) === filters.status);

    if (filters.sort === "Latest") {
      list.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (filters.sort === "Oldest") {
      list.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    } else if (filters.sort === "Match Score") {
      list.sort((a, b) => b.matchScore - a.matchScore);
    } else if (filters.sort === "Salary") {
      list.sort((a, b) => extractSalary(b.salaryRange) - extractSalary(a.salaryRange));
    }

    return list;
  }, [filters, scored, onlyMatches, hasPreferences, preferences.minMatchScore, getStatus]);

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-6 py-10">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Dashboard
      </h1>
      <p className="mt-1 text-muted-foreground">
        {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
      </p>

      {!hasPreferences && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            Set your preferences to activate intelligent matching.{" "}
            <Link to="/settings" className="font-semibold underline">
              Go to Settings
            </Link>
          </span>
        </div>
      )}

      <div className="mt-6">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {hasPreferences && (
        <div className="mt-4 flex items-center gap-3">
          <Switch
            id="match-toggle"
            checked={onlyMatches}
            onCheckedChange={setOnlyMatches}
          />
          <Label htmlFor="match-toggle" className="cursor-pointer text-sm">
            Show only jobs above my threshold ({preferences.minMatchScore}%)
          </Label>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            matchScore={job.matchScore}
            showScore={hasPreferences}
            isSaved={isSaved(job.id)}
            status={getStatus(job.id)}
            onToggleSave={toggleSave}
            onView={setViewJob}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">
          No roles match your criteria. Adjust filters or lower threshold.
        </p>
      )}

      <JobDetailModal
        job={viewJob}
        open={!!viewJob}
        onOpenChange={(open) => !open && setViewJob(null)}
      />
    </main>
  );
};

function extractSalary(range: string): number {
  const nums = range.match(/(\d+)/g);
  if (!nums) return 0;
  return Math.max(...nums.map(Number));
}

export default Dashboard;
