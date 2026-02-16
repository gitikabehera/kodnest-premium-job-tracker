import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-prose flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-5xl font-bold text-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        This page doesn't exist. Check the URL or navigate back.
      </p>
      <a
        href="/"
        className="mt-6 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      >
        Return to Home
      </a>
    </main>
  );
};

export default NotFound;
