import type { Job } from "@/data/jobs";
import type { Preferences } from "@/hooks/use-preferences";

export function computeMatchScore(job: Job, prefs: Preferences): number {
  let score = 0;

  const keywords = prefs.roleKeywords
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  const userSkills = prefs.skills
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // +25 if any roleKeyword appears in job.title
  if (keywords.some((kw) => job.title.toLowerCase().includes(kw))) {
    score += 25;
  }

  // +15 if any roleKeyword appears in job.description
  if (keywords.some((kw) => job.description.toLowerCase().includes(kw))) {
    score += 15;
  }

  // +15 if job.location matches preferredLocations
  if (prefs.preferredLocations.some((loc) => loc === job.location)) {
    score += 15;
  }

  // +10 if job.mode matches preferredMode
  if (prefs.preferredMode.includes(job.mode)) {
    score += 10;
  }

  // +10 if job.experience matches experienceLevel
  if (prefs.experienceLevel && job.experience === prefs.experienceLevel) {
    score += 10;
  }

  // +15 if overlap between job.skills and user.skills
  if (
    userSkills.length > 0 &&
    job.skills.some((s) => userSkills.includes(s.toLowerCase()))
  ) {
    score += 15;
  }

  // +5 if postedDaysAgo <= 2
  if (job.postedDaysAgo <= 2) {
    score += 5;
  }

  // +5 if source is LinkedIn
  if (job.source === "LinkedIn") {
    score += 5;
  }

  return Math.min(score, 100);
}

export function scoreColor(score: number): string {
  if (score >= 80) return "bg-green-600/15 text-green-700 border-green-600/25";
  if (score >= 60) return "bg-amber-500/15 text-amber-700 border-amber-500/25";
  if (score >= 40) return "bg-muted text-muted-foreground border-border";
  return "bg-muted/50 text-muted-foreground/60 border-transparent";
}
