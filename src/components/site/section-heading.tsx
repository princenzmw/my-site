/**
 * Shared section heading: kicker + title (+ optional description), centered.
 * `level` picks the heading tag: pages whose section IS the page use h1,
 * sections inside a page use h2.
 */
export function SectionHeading({
  kicker,
  title,
  description,
  level = "h2",
}: {
  kicker: string;
  title: string;
  description?: string;
  level?: "h1" | "h2";
}) {
  const Heading = level;
  return (
    <div className="reveal-view mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{kicker}</p>
      <Heading className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</Heading>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
