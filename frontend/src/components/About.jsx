import Reveal from "./Reveal";

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
              I started my career sourcing and valuing private companies
              across global markets as a Private Equity deal sourcing
              specialist, and sharpening my diligence instincts in business
              consulting at Ernst &amp; Young. Today, I run an independent
              deal sourcing practice for PE, VC, and search fund clients,
              servicing their thesis and building a high-quality deal
              pipeline for them. My primary goal is to reduce the cost and
              man-hours required to source deals, allowing my clients to
              focus on execution rather than sourcing.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
