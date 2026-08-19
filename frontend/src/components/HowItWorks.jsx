import Reveal from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Discovery",
    body: "We define your acquisition thesis together — sector, size, geography, and deal structure — so every target sourced actually fits your mandate.",
  },
  {
    n: "02",
    title: "Sourcing",
    body: "You receive a curated pipeline of off-market and network-sourced targets, delivered on a cadence matched to your mandate — not a generic list pulled from a broker database.",
  },
  {
    n: "03",
    title: "Qualification",
    body: "Every target arrives pre-vetted with a structured profile, so your time goes to negotiation and diligence — not screening.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="text-sm font-semibold tracking-[0.2em] text-[var(--color-gold)] uppercase mb-3">
            How It Works
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-[var(--color-navy)] mb-12 max-w-lg">
            A simple, thesis-first sourcing process.
          </p>
        </Reveal>

        <div id="services" className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} style={{ transitionDelay: `${i * 100}ms` }} className="bg-white rounded-xl p-8 border border-gray-100">
              <span className="text-4xl font-bold text-gray-200">{step.n}</span>
              <h3 className="text-lg font-semibold text-[var(--color-navy)] mt-4 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <a
            href="#contact"
            className="inline-block bg-[var(--color-navy)] text-white font-medium px-6 py-3 rounded-md hover:bg-[var(--color-navy-light)] transition-colors"
          >
            Book a Discovery Call
          </a>
        </Reveal>
      </div>
    </section>
  );
}
