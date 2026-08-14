interface LegalDocumentSection {
  readonly heading: string;
  readonly body: string;
}

interface LegalDocumentProps {
  title: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  sections: readonly LegalDocumentSection[];
}

export function LegalDocument({
  title,
  lastUpdatedLabel,
  lastUpdated,
  sections,
}: LegalDocumentProps) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-12">
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <span className="text-sm text-muted-foreground">
          {lastUpdatedLabel}: {lastUpdated}
        </span>
      </div>
      <div className="flex flex-col gap-6">
        {sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-2">
            <h2 className="text-base font-medium text-foreground">{section.heading}</h2>
            <p className="text-sm whitespace-pre-wrap text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
