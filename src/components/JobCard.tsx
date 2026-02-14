import type { Job } from "@/data/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Briefcase,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Eye,
} from "lucide-react";

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
  onView: (job: Job) => void;
}

const sourceBadgeClass: Record<string, string> = {
  LinkedIn: "bg-primary/10 text-primary border-primary/20",
  Naukri: "bg-blue-600/10 text-blue-700 border-blue-600/20",
  Indeed: "bg-amber-600/10 text-amber-700 border-amber-600/20",
};

function postedLabel(days: number) {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

const JobCard = ({ job, isSaved, onToggleSave, onView }: JobCardProps) => (
  <Card className="group transition-shadow hover:shadow-md">
    <CardContent className="p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-semibold leading-tight text-foreground">
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-muted-foreground">
            {job.company}
          </p>
        </div>
        <Badge variant="outline" className={sourceBadgeClass[job.source] ?? ""}>
          {job.source}
        </Badge>
      </div>

      {/* Meta row */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location} · {job.mode}
        </span>
        <span className="inline-flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" />
          {job.experience}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {postedLabel(job.postedDaysAgo)}
        </span>
      </div>

      {/* Salary */}
      <p className="mt-3 text-sm font-semibold text-foreground">
        {job.salaryRange}
      </p>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(job)}
          className="gap-1.5"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant={isSaved ? "default" : "outline"}
          size="sm"
          onClick={() => onToggleSave(job.id)}
          className="gap-1.5"
        >
          {isSaved ? (
            <BookmarkCheck className="h-3.5 w-3.5" />
          ) : (
            <Bookmark className="h-3.5 w-3.5" />
          )}
          {isSaved ? "Saved" : "Save"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          asChild
        >
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            Apply
          </a>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default JobCard;
