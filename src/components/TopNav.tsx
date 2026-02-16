import { Link, useLocation } from "react-router-dom";
import { useTestChecklist } from "@/hooks/use-test-checklist";
import { useProofSubmission } from "@/hooks/use-proof-submission";
import { Badge } from "@/components/ui/badge";

const steps = [
  { path: "/", label: "Home", step: 0 },
  { path: "/dashboard", label: "Dashboard", step: 1 },
  { path: "/saved", label: "Saved", step: 2 },
  { path: "/settings", label: "Settings", step: 3 },
  { path: "/digest", label: "Digest", step: 4 },
  { path: "/proof", label: "Proof", step: 5 },
  { path: "/jt/07-test", label: "Test", step: 6 },
  { path: "/jt/08-ship", label: "Ship", step: 7 },
  { path: "/jt/proof", label: "Submit", step: 8 },
];

const statusBadgeMap = {
  "Not Started": "border-border bg-muted text-muted-foreground",
  "In Progress": "border-primary/20 bg-primary/5 text-primary",
  Shipped: "border-success/30 bg-success/10 text-success",
} as const;

const TopNav = () => {
  const { pathname } = useLocation();
  const { passedCount } = useTestChecklist();
  const { shipStatus } = useProofSubmission();

  const currentStep = steps.find((s) => s.path === pathname);
  const stepLabel = currentStep
    ? `Step ${currentStep.step} / ${steps.length - 1}`
    : "";

  const badgeClass = statusBadgeMap[shipStatus] ?? statusBadgeMap["Not Started"];

  const navItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Saved", to: "/saved" },
    { label: "Digest", to: "/digest" },
    { label: "Settings", to: "/settings" },
    { label: "Test", to: "/jt/07-test" },
    { label: "Submit", to: "/jt/proof" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Left: Project name */}
        <Link
          to="/"
          className="font-heading text-xl font-bold tracking-tight text-foreground"
        >
          KodNest
        </Link>

        {/* Center: Progress indicator (desktop) */}
        <span className="hidden text-xs font-medium tracking-wide text-muted-foreground md:block">
          {stepLabel}
        </span>

        {/* Right: Status badge + nav */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex gap-6">
            {navItems.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative py-5 text-sm font-medium tracking-wide transition-all duration-150 ease-in-out ${
                    active
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Badge variant="outline" className={badgeClass}>
            {shipStatus}
          </Badge>
        </div>

        {/* Mobile: badge only (menu below) */}
        <div className="flex items-center gap-3 md:hidden">
          <Badge variant="outline" className={`text-xs ${badgeClass}`}>
            {shipStatus}
          </Badge>
          <MobileMenu navItems={navItems} pathname={pathname} />
        </div>
      </div>
    </header>
  );
};

/* Mobile hamburger */
import { useState } from "react";
import { Menu, X } from "lucide-react";

function MobileMenu({
  navItems,
  pathname,
}: {
  navItems: { label: string; to: string }[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center rounded-md p-2 text-foreground"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-16 border-b border-border bg-background px-6 pb-4">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block py-3 text-sm font-medium tracking-wide transition-all duration-150 ease-in-out ${
                  active
                    ? "text-primary border-l-2 border-primary pl-3"
                    : "text-muted-foreground hover:text-foreground pl-3"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}

export default TopNav;
