import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => (
  <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-6 text-center">
    <h1 className="font-heading text-5xl font-bold tracking-tight text-foreground md:text-7xl">
      Stop Missing The Right Jobs.
    </h1>
    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
      Precision-matched job discovery delivered daily at 9AM.
    </p>
    <Button asChild size="lg" className="mt-10 gap-2 px-8 text-base">
      <Link to="/settings">
        Start Tracking
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  </main>
);

export default Index;
