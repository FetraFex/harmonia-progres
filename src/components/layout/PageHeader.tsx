interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-text sm:text-5xl">{title}</h1>
          <p className="mt-6 text-lg text-text-secondary">{description}</p>
        </div>
      </div>
    </div>
  );
}
