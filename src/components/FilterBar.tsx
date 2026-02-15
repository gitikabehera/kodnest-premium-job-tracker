import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export interface Filters {
  keyword: string;
  location: string;
  mode: string;
  experience: string;
  source: string;
  sort: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const locations = ["All", "Bangalore", "Hyderabad", "Chennai", "Pune", "Mumbai", "Noida", "Mysore"];
const modes = ["All", "Remote", "Hybrid", "Onsite"];
const experiences = ["All", "Fresher", "0-1", "1-3", "3-5"];
const sources = ["All", "LinkedIn", "Naukri", "Indeed"];
const sorts = ["Latest", "Oldest", "Match Score", "Salary"];

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  const set = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search title or company…"
          value={filters.keyword}
          onChange={(e) => set("keyword", e.target.value)}
          className="pl-9"
        />
      </div>

      <FilterSelect label="Location" value={filters.location} options={locations} onValueChange={(v) => set("location", v)} />
      <FilterSelect label="Mode" value={filters.mode} options={modes} onValueChange={(v) => set("mode", v)} />
      <FilterSelect label="Experience" value={filters.experience} options={experiences} onValueChange={(v) => set("experience", v)} />
      <FilterSelect label="Source" value={filters.source} options={sources} onValueChange={(v) => set("source", v)} />
      <FilterSelect label="Sort" value={filters.sort} options={sorts} onValueChange={(v) => set("sort", v)} />
    </div>
  );
};

function FilterSelect({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  options: string[];
  onValueChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="z-50 bg-popover">
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default FilterBar;
