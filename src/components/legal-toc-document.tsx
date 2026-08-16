interface LegalTocSection {
  readonly heading: string;
  readonly body: string;
}

interface LegalTocDocumentProps {
  title: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  sections: readonly LegalTocSection[];
}

function toSectionId(heading: string, index: number): string {
  return `section-${index}-${heading.replace(/[^\p{L}\p{N}]+/gu, '-')}`;
}

export function LegalTocDocument({
  title,
  lastUpdatedLabel,
  lastUpdated,
  sections,
}: LegalTocDocumentProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-muted px-8 py-16 sm:px-16 lg:px-24">
        <h1 className="font-heading text-4xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {lastUpdatedLabel}: {lastUpdated}
        </p>
      </div>
      <div className="flex flex-1 gap-10 px-8 py-12 sm:px-16 lg:px-24">
        <nav className="hidden w-70 shrink-0 flex-col gap-1 border-r border-border pr-6 lg:flex">
          <span className="mb-2 text-xs font-bold tracking-wide text-primary uppercase">
            Table of Contents
          </span>
          {sections.map((section, index) => (
            <a
              key={section.heading}
              href={`#${toSectionId(section.heading, index)}`}
              className={
                index === 0
                  ? 'rounded-md bg-primary-soft px-3 py-2.5 text-sm font-semibold text-primary'
                  : 'rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted'
              }
            >
              {section.heading}
            </a>
          ))}
        </nav>
        <div className="flex max-w-3xl flex-1 flex-col gap-8">
          {sections.map((section, index) => (
            <section
              key={section.heading}
              id={toSectionId(section.heading, index)}
              className="flex flex-col gap-2"
            >
              <h2 className="font-heading text-xl font-bold text-foreground">{section.heading}</h2>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
