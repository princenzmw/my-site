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
  size = "default",
}: {
  kicker: string;
  title: string;
  description?: string;
  level?: "h1" | "h2";
  size?: "default" | "large" | "small";
}) {
  const Heading = level;
  const sizeClass = {
    small: "mt-2 text-2xl font-semibold tracking-tight sm:text-3xl",
    default: "mt-2 text-3xl font-bold tracking-tight sm:text-4xl",
    large: "mt-2 text-[clamp(2rem,4vw+0.5rem,3rem)] font-extrabold tracking-[-0.02em]",
  }[size];

  return (
    <div className="reveal-view mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{kicker}</p>
      <Heading className={sizeClass}>{title}</Heading>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
