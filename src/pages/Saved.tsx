import { useState } from "react";
import { jobs, type Job } from "@/data/jobs";
import { useSavedJobs } from "@/hooks/use-saved-jobs";
import JobCard from "@/components/JobCard";
import JobDetailModal from "@/components/JobDetailModal";
import { Bookmark } from "lucide-react";

const Saved = () => {
  const { savedIds, toggleSave, isSaved } = useSavedJobs();
  const [viewJob, setViewJob] = useState<Job | null>(null);

  const savedJobs = jobs.filter((j) => savedIds.includes(j.id));

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-6 py-10">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Saved Jobs
      </h1>
      <p className="mt-1 text-muted-foreground">
        {savedJobs.length} saved job{savedJobs.length !== 1 ? "s" : ""}
      </p>

      {savedJobs.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={isSaved(job.id)}
              onToggleSave={toggleSave}
              onView={setViewJob}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Bookmark
            className="h-16 w-16 text-muted-foreground/40"
            strokeWidth={1}
          />
          <h2 className="mt-6 font-heading text-2xl font-semibold text-foreground">
            No saved jobs yet
          </h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Bookmark jobs from the Dashboard and they will appear here for quick
            access.
          </p>
        </div>
      )}

      <JobDetailModal
        job={viewJob}
        open={!!viewJob}
        onOpenChange={(open) => !open && setViewJob(null)}
      />
    </main>
  );
};

export default Saved;
