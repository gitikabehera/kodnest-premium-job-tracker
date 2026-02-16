import { useTestChecklist } from "@/hooks/use-test-checklist";
import { Link, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowLeft } from "lucide-react";

const Ship = () => {
  const { allPassed } = useTestChecklist();

  if (!allPassed) {
    return <Navigate to="/jt/07-test" replace />;
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <Rocket className="h-16 w-16 text-primary" strokeWidth={1} />
      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Ready to Ship
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        All tests passed. Your Job Notification Tracker is verified and ready
        for deployment.
      </p>
      <Card className="mt-8 w-full max-w-sm">
        <CardContent className="p-6 text-sm text-muted-foreground">
          ✅ 10 / 10 checks completed — no blockers found.
        </CardContent>
      </Card>
      <Button variant="outline" size="sm" className="mt-6" asChild>
        <Link to="/jt/07-test">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Checklist
        </Link>
      </Button>
    </main>
  );
};

export default Ship;
