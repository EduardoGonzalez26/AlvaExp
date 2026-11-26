type Props = {
  stats: {value: string; label: string}[];
  sourceNote: string;
};

/**
 * Why Latin America hero signature: the region's scale in two figures. On
 * desktop the figures take the left of the band and the source sits at its
 * right edge, on the same 12-column grid as the hero. The markup is the
 * final state; heroSignature() draws the rule and counts the figures up.
 */
export function HeroStats({stats, sourceNote}: Props) {
  return (
    <figure className="relative pt-6 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-8 lg:pt-[clamp(1.25rem,3svh,2rem)]">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-alva-stone/40"
        data-m="stats-rule"
      />
      <dl className="flex flex-wrap gap-y-6 lg:col-span-8">
        {stats.map((stat, index) => (
          <div
            className={
              index === 0
                ? "flex flex-col-reverse gap-1 pr-[clamp(2rem,5vw,4.5rem)]"
                : "flex flex-col-reverse gap-1 border-l border-alva-stone/30 pl-[clamp(2rem,5vw,4.5rem)] pr-[clamp(2rem,5vw,4.5rem)]"
            }
            key={stat.label}
          >
            <dt className="text-eyebrow uppercase text-alva-stone" data-m="stats-label">
              {stat.label}
            </dt>
            <dd className="overflow-hidden pb-[0.08em]">
              <span
                className="block font-serif text-stat tabular-nums lg:text-[length:min(5vw,8svh)]"
                data-m="count"
                data-value={stat.value}
              >
                {stat.value}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <figcaption
        className="mt-4 max-w-[28rem] text-pretty text-caption text-alva-stone lg:col-span-4 lg:col-start-9 lg:mt-0 lg:justify-self-end lg:pb-1 lg:text-right"
        data-m="stats-note"
      >
        {sourceNote}
      </figcaption>
    </figure>
  );
}
