import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { jobs, type Job } from "@/data/jobs";
import { usePreferences } from "@/hooks/use-preferences";
import { computeMatchScore, scoreColor } from "@/lib/match-score";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Clipboard,
  ExternalLink,
  MapPin,
  Briefcase,
  Sparkles,
  AlertTriangle,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface DigestEntry {
  id: number;
  title: string;
  company: string;
  location: string;
  experience: string;
  matchScore: number;
  applyUrl: string;
}

function digestKey(date: Date) {
  return `jobTrackerDigest_${format(date, "yyyy-MM-dd")}`;
}

function loadDigest(date: Date): DigestEntry[] | null {
  try {
    const stored = localStorage.getItem(digestKey(date));
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveDigest(date: Date, entries: DigestEntry[]) {
  localStorage.setItem(digestKey(date), JSON.stringify(entries));
}

function digestToPlainText(entries: DigestEntry[], dateStr: string): string {
  const lines = [`Top 10 Jobs For You — 9AM Digest`, `Date: ${dateStr}`, ""];
  entries.forEach((e, i) => {
    lines.push(
      `${i + 1}. ${e.title} at ${e.company}`,
      `   Location: ${e.location} | Experience: ${e.experience} | Match: ${e.matchScore}%`,
      `   Apply: ${e.applyUrl}`,
      ""
    );
  });
  lines.push("This digest was generated based on your preferences.");
  return lines.join("\n");
}

const Digest = () => {
  const today = new Date();
  const dateStr = format(today, "MMMM d, yyyy");
  const { preferences, hasPreferences } = usePreferences();
  const [digest, setDigest] = useState<DigestEntry[] | null>(() => loadDigest(today));
  const [copied, setCopied] = useState(false);

  const generateDigest = useCallback(() => {
    const scored = jobs
      .map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        experience: job.experience,
        matchScore: computeMatchScore(job, preferences),
        applyUrl: job.applyUrl,
        postedDaysAgo: job.postedDaysAgo,
      }))
      .sort((a, b) => b.matchScore - a.matchScore || a.postedDaysAgo - b.postedDaysAgo)
      .slice(0, 10)
      .map(({ postedDaysAgo, ...rest }) => rest);

    saveDigest(today, scored);
    setDigest(scored);
    toast.success("Digest generated successfully.");
  }, [preferences, today]);

  const handleCopy = useCallback(async () => {
    if (!digest) return;
    await navigator.clipboard.writeText(digestToPlainText(digest, dateStr));
    setCopied(true);
    toast.success("Digest copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  }, [digest, dateStr]);

  const mailtoHref = useMemo(() => {
    if (!digest) return "#";
    const subject = encodeURIComponent("My 9AM Job Digest");
    const body = encodeURIComponent(digestToPlainText(digest, dateStr));
    return `mailto:?subject=${subject}&body=${body}`;
  }, [digest, dateStr]);

  // No preferences
  if (!hasPreferences) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <AlertTriangle className="h-16 w-16 text-amber-500/60" strokeWidth={1} />
        <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-foreground">
          Set preferences first
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Set preferences to generate a personalized digest.
        </p>
        <Button asChild className="mt-6">
          <Link to="/settings">Go to Settings</Link>
        </Button>
      </main>
    );
  }

  // No digest yet
  if (!digest) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <Mail className="h-16 w-16 text-muted-foreground/40" strokeWidth={1} />
        <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-foreground">
          No digests yet
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Generate your simulated 9AM digest to see today's top matches.
        </p>
        <Button onClick={generateDigest} className="mt-6 gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Today's 9AM Digest (Simulated)
        </Button>
        <p className="mt-4 text-xs text-muted-foreground/60">
          Demo Mode: Daily 9AM trigger simulated manually.
        </p>
      </main>
    );
  }

  // Empty matches
  if (digest.length === 0) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <Mail className="h-16 w-16 text-muted-foreground/40" strokeWidth={1} />
        <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-foreground">
          No matching roles today
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Check again tomorrow.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-3xl px-6 py-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Top 10 Jobs For You
        </h1>
        <p className="mt-1 text-lg text-primary font-medium">9AM Digest</p>
        <p className="mt-1 text-muted-foreground">{dateStr}</p>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={handleCopy} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Digest to Clipboard"}
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <a href={mailtoHref}>
            <Mail className="h-4 w-4" />
            Create Email Draft
          </a>
        </Button>
        <Button variant="outline" onClick={generateDigest} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Regenerate
        </Button>
      </div>

      {/* Digest card */}
      <Card className="mt-8">
        <CardContent className="divide-y divide-border p-0">
          {digest.map((entry, i) => (
            <div key={entry.id} className="flex items-center gap-4 px-5 py-4">
              <span className="shrink-0 font-heading text-lg font-semibold text-muted-foreground/50 w-6 text-right">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-base font-semibold leading-tight text-foreground">
                  {entry.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {entry.company}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {entry.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {entry.experience}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className={scoreColor(entry.matchScore)}>
                {entry.matchScore}%
              </Badge>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5" asChild>
                <a href={entry.applyUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Apply
                </a>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        This digest was generated based on your preferences.
      </p>
      <p className="mt-2 text-center text-xs text-muted-foreground/60">
        Demo Mode: Daily 9AM trigger simulated manually.
      </p>
    </main>
  );
};

export default Digest;
