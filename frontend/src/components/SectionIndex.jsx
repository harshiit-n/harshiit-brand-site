import useActiveSection from "../hooks/useActiveSection";

// A small fixed marker on the edge of the viewport showing which section is
// currently in view. Deliberately quiet by default (just a dot rail) so it
// reads as a considered detail rather than chrome competing with the page;
// the label only appears on hover. Hidden below lg where there's no room.
export default function SectionIndex({ sections }) {
  const ids = sections.map((s) => s.id);
  const activeId = useActiveSection(ids);
  const activeIndex = Math.max(ids.indexOf(activeId), 0);

  return (
    <div className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="pointer-events-auto flex flex-col items-center gap-4">
        {sections.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} aria-label={`Jump to ${s.label}`} className="group relative flex items-center py-1">
            <span
              className={`block rounded-full ring-1 transition-all duration-300 ${
                i === activeIndex
                  ? "h-2.5 w-2.5 bg-[var(--color-accent)] ring-2 ring-white/70"
                  : "h-1.5 w-1.5 bg-white/90 ring-[var(--color-navy)]/20 group-hover:bg-white"
              }`}
            />
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-[var(--color-navy)] px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              {s.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
