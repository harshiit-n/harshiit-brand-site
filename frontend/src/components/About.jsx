import Reveal from "./Reveal";
import GlobeVisual from "./GlobeVisual";

const MARKS = [
  { value: "CFA Level II", label: "Candidate, CFA Institute" },
  { value: "Ernst & Young", label: "Business Consulting" },
];

export default function About() {
  return (
    <section id="about" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-charcoal)]">
              About Me
            </p>
            <h2
              className="text-3xl font-bold leading-tight text-[var(--color-navy)] md:text-4xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Building the infrastructure between the right targets and the
              right investors.
            </h2>
          </Reveal>

          <Reveal style={{ transitionDelay: "100ms" }}>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-gray-600">
              I built my early career inside the deal room, sourcing and
              valuing private companies across global markets as a Private
              Equity Analyst, and sharpening my diligence instincts in
              business consulting at Ernst &amp; Young. Today, I run an
              independent deal sourcing practice for PE, VC, and search fund
              clients.
            </p>
          </Reveal>
        </div>

        <Reveal
          style={{ transitionDelay: "200ms" }}
          className="mx-auto mt-16 grid max-w-4xl items-center gap-10 rounded-2xl border border-gray-100 bg-[var(--color-offwhite)] p-8 text-left md:grid-cols-[1fr_auto] md:p-12"
        >
          <div>
            <p
              className="text-xl font-bold text-[var(--color-navy)] md:text-2xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Global Coverage
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
              Sourcing and connecting across markets worldwide, not
              limited to any single region or network.
            </p>
          </div>
          <GlobeVisual className="mx-auto h-40 w-40 text-[var(--color-navy)] md:h-48 md:w-48" />
        </Reveal>

        <Reveal
          style={{ transitionDelay: "300ms" }}
          className="mx-auto mt-12 flex max-w-3xl flex-wrap items-start justify-center gap-x-10 gap-y-10"
        >
          {MARKS.map((m, i) => (
            <div
              key={m.value}
              className={`text-center ${
                i > 0 ? "lg:border-l lg:border-[var(--color-charcoal)]/15 lg:pl-10" : ""
              }`}
            >
              <p
                className="text-xl font-bold text-[var(--color-navy)] md:text-2xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {m.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">{m.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
