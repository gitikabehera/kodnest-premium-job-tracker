import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePreferences, defaultPreferences, type Preferences } from "@/hooks/use-preferences";
import { toast } from "sonner";

const allLocations = ["Bangalore", "Hyderabad", "Chennai", "Pune", "Mumbai", "Noida", "Mysore"];
const allModes = ["Remote", "Hybrid", "Onsite"] as const;
const experienceLevels = ["Fresher", "0-1", "1-3", "3-5"];

const Settings = () => {
  const { preferences, save } = usePreferences();
  const [form, setForm] = useState<Preferences>(preferences);

  useEffect(() => {
    setForm(preferences);
  }, [preferences]);

  const toggleLocation = (loc: string) => {
    setForm((f) => ({
      ...f,
      preferredLocations: f.preferredLocations.includes(loc)
        ? f.preferredLocations.filter((l) => l !== loc)
        : [...f.preferredLocations, loc],
    }));
  };

  const toggleMode = (mode: string) => {
    setForm((f) => ({
      ...f,
      preferredMode: f.preferredMode.includes(mode)
        ? f.preferredMode.filter((m) => m !== mode)
        : [...f.preferredMode, mode],
    }));
  };

  const handleSave = () => {
    save(form);
    toast.success("Preferences saved successfully.");
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-2xl px-6 py-16">
      <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground">
        Settings
      </h1>
      <p className="mt-2 text-muted-foreground">
        Configure your job tracking preferences.
      </p>

      <div className="mt-12 space-y-10">
        {/* Role Keywords */}
        <div className="space-y-2">
          <Label htmlFor="keywords">Role Keywords</Label>
          <Input
            id="keywords"
            placeholder="e.g. Frontend, SDE, React, Python"
            value={form.roleKeywords}
            onChange={(e) => setForm({ ...form, roleKeywords: e.target.value })}
          />
          <p className="text-sm text-muted-foreground">
            Comma-separated keywords to match job titles and descriptions.
          </p>
        </div>

        {/* Preferred Locations */}
        <div className="space-y-3">
          <Label>Preferred Locations</Label>
          <div className="flex flex-wrap gap-2">
            {allLocations.map((loc) => (
              <Badge
                key={loc}
                variant={form.preferredLocations.includes(loc) ? "default" : "outline"}
                className="cursor-pointer select-none"
                onClick={() => toggleLocation(loc)}
              >
                {loc}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Click to select one or more cities.
          </p>
        </div>

        {/* Mode */}
        <div className="space-y-3">
          <Label>Mode</Label>
          <div className="flex gap-6">
            {allModes.map((mode) => (
              <div key={mode} className="flex items-center gap-2">
                <Checkbox
                  id={`mode-${mode}`}
                  checked={form.preferredMode.includes(mode)}
                  onCheckedChange={() => toggleMode(mode)}
                />
                <Label
                  htmlFor={`mode-${mode}`}
                  className="cursor-pointer font-normal"
                >
                  {mode}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select
            value={form.experienceLevel}
            onValueChange={(v) => setForm({ ...form, experienceLevel: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {experienceLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <Input
            id="skills"
            placeholder="e.g. React, Java, Python, SQL"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
          <p className="text-sm text-muted-foreground">
            Comma-separated list of your skills.
          </p>
        </div>

        {/* Min Match Score */}
        <div className="space-y-3">
          <Label>Minimum Match Score: {form.minMatchScore}%</Label>
          <Slider
            value={[form.minMatchScore]}
            onValueChange={([v]) => setForm({ ...form, minMatchScore: v })}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Only jobs scoring at or above this threshold appear with the "Show only matches" toggle.
          </p>
        </div>

        <Button size="lg" className="mt-4 px-8" onClick={handleSave}>
          Save Preferences
        </Button>
      </div>
    </main>
  );
};

export default Settings;
