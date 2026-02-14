import { Inbox } from "lucide-react";

const Dashboard = () => (
  <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-6 text-center">
    <Inbox className="h-16 w-16 text-muted-foreground/40" strokeWidth={1} />
    <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
      No jobs yet.
    </h1>
    <p className="mt-3 max-w-md text-muted-foreground">
      In the next step, you will load a realistic dataset.
    </p>
  </main>
);

export default Dashboard;
