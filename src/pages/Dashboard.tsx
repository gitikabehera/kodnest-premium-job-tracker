import { useState, useMemo } from "react";
import { jobs, type Job } from "@/data/jobs";
import { useSavedJobs } from "@/hooks/use-saved-jobs";
import FilterBar, { type Filters } from "@/components/FilterBar";
import JobCard from "@/components/JobCard";
import JobDetailModal from "@/components/JobDetailModal";

const defaultFilters: Filters = {
  keyword: "",
  location: "All",
  mode: "All",
  experience: "All",
  source: "All",
  sort: "Latest",
};

const Dashboard = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const { toggleSave, isSaved } = useSavedJobs();

  const filtered = useMemo(() => {
    let list = [...jobs];

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

    list.sort((a, b) =>
      filters.sort === "Latest"
        ? a.postedDaysAgo - b.postedDaysAgo
        : b.postedDaysAgo - a.postedDaysAgo
    );

    return list;
  }, [filters]);

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-6 py-10">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Dashboard
      </h1>
      <p className="mt-1 text-muted-foreground">
        {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
      </p>

      <div className="mt-6">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSaved={isSaved(job.id)}
            onToggleSave={toggleSave}
            onView={setViewJob}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">
          No jobs match your filters. Try broadening your search.
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

export default Dashboard;
