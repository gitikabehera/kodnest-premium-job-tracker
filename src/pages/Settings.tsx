import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Settings = () => (
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
          placeholder="e.g. Frontend Engineer, React Developer"
        />
        <p className="text-sm text-muted-foreground">
          Comma-separated keywords to match job titles.
        </p>
      </div>

      {/* Preferred Locations */}
      <div className="space-y-2">
        <Label htmlFor="locations">Preferred Locations</Label>
        <Input
          id="locations"
          placeholder="e.g. Bangalore, Hyderabad, Remote"
        />
        <p className="text-sm text-muted-foreground">
          Comma-separated list of cities or regions.
        </p>
      </div>

      {/* Mode */}
      <div className="space-y-3">
        <Label>Mode</Label>
        <RadioGroup defaultValue="remote" className="flex gap-6">
          {["Remote", "Hybrid", "Onsite"].map((mode) => (
            <div key={mode} className="flex items-center gap-2">
              <RadioGroupItem
                value={mode.toLowerCase()}
                id={`mode-${mode.toLowerCase()}`}
              />
              <Label
                htmlFor={`mode-${mode.toLowerCase()}`}
                className="cursor-pointer font-normal"
              >
                {mode}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <Label>Experience Level</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            {["Fresher", "1-3 Years", "3-5 Years", "5-8 Years", "8+ Years"].map(
              (level) => (
                <SelectItem key={level} value={level.toLowerCase()}>
                  {level}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <Button size="lg" className="mt-4 px-8" disabled>
        Save Preferences
      </Button>
      <p className="text-sm text-muted-foreground">
        Saving will be enabled in the next step.
      </p>
    </div>
  </main>
);

export default Settings;
