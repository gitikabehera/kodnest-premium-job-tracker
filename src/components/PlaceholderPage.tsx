interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-6">
      <h1 className="font-heading text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
        {title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        This section will be built in the next step.
      </p>
    </div>
  );
};

export default PlaceholderPage;
