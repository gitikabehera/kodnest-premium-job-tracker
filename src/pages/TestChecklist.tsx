import { Link } from "react-router-dom";
import { useTestChecklist, testItems } from "@/hooks/use-test-checklist";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, CheckCircle2, HelpCircle, RotateCcw, Rocket } from "lucide-react";

const TestChecklist = () => {
  const { checked, toggle, reset, passedCount, allPassed } = useTestChecklist();
  const total = testItems.length;

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-2xl px-6 py-10">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Test Checklist
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Demo Mode: Manually verify each feature before shipping.
      </p>

      {/* Summary */}
      <Card className="mt-8">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Tests Passed: {passedCount} / {total}
            </CardTitle>
            {allPassed ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={(passedCount / total) * 100} className="h-2" />
          {!allPassed && (
            <p className="mt-3 text-sm text-destructive">
              Resolve all issues before shipping.
            </p>
          )}
          {allPassed && (
            <p className="mt-3 text-sm text-primary">
              All tests passed! You're ready to ship.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card className="mt-6">
        <CardContent className="divide-y divide-border pt-6">
          {testItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3.5">
              <Checkbox
                id={item.id}
                checked={!!checked[item.id]}
                onCheckedChange={() => toggle(item.id)}
              />
              <label
                htmlFor={item.id}
                className={`flex-1 cursor-pointer text-sm font-medium leading-none ${
                  checked[item.id]
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="shrink-0 text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs text-xs">
                  {item.howToTest}
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset Test Status
        </Button>

        {allPassed ? (
          <Button asChild size="sm">
            <Link to="/jt/08-ship">
              <Rocket className="mr-1.5 h-3.5 w-3.5" />
              Proceed to Ship
            </Link>
          </Button>
        ) : (
          <Button size="sm" disabled>
            <Rocket className="mr-1.5 h-3.5 w-3.5" />
            Proceed to Ship
          </Button>
        )}
      </div>
    </main>
  );
};

export default TestChecklist;
