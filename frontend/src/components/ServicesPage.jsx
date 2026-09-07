import { useState } from "react";
import Reveal from "./Reveal";
import ExpertRequestForm from "./ExpertRequestForm";
import SectionIndex from "./SectionIndex";
import useTrackedClick from "../hooks/useTrackedClick";

const SOURCING_STEPS = [
  { n: "01", title: "Define", body: "We lock down your mandate together: sector, size, geography, and deal structure." },
  { n: "02", title: "Source", body: "You get a curated pipeline of off-market and network-sourced targets, not a broker list." },
  { n: "03", title: "Qualify", body: "Every target arrives pre-vetted with a structured profile, ready for diligence." },
];

const NETWORK_STEPS = [
  { n: "01", title: "Understand", body: "I learn what you're stuck on, and what the right person actually looks like for it." },
  { n: "02", title: "Match", body: "I search across my network globally, across any field, for someone who's solved this exact problem before." },
  { n: "03", title: "Arrange", body: "I reach out and work to set up a call directly, not just hand you a name and a LinkedIn link." },
];

const SERVICES_SECTIONS = [
  { id: "services-top", label: "Overview" },
  { id: "deal-sourcing", label: "Deal Sourcing" },
  { id: "expert-network", label: "Expert Network" },
];

export default function ServicesPage() {
  const [focus, setFocus] = useState("both"); // "both" | "sourcing" | "network"
  const onBookingClick = useTrackedClick("booking_link_clicked", "services");

  function choose(next) {
    setFocus((current) => (current === next ? "both" : next));
    const targetId = next === "sourcing" ? "deal-sourcing" : "expert-network";
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <SectionIndex sections={SERVICES_SECTIONS} />

      <section
        id="services-top"
        className="relative overflow-hidden bg-gradient-to-br from-[#12314f] via-[var(--color-navy)] to-[var(--color-navy-dark)] pt-32 pb-20 text-white md:pt-40 md:pb-28"
      >
        <div className="grain-overlay" />
        <div className="pointer-events-none absolute right-[-10%] top-1/3 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] md:text-sm">
            What I Do
          </p>
          <h1
            className="text-4xl font-bold leading-[1.05] md:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Two ways I help deals happen.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
            Whether you're hunting for the right acquisition or the right
            advisor, I close the gap between the search and the find.
          </p>

          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-3 rounded-full bg-white/10 p-1.5">
            <button
              type="button"
              onClick={() => choose("sourcing")}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                focus === "sourcing" ? "bg-white text-[var(--color-navy)]" : "text-white/80 hover:text-white"
              }`}
            >
              I need a target
            </button>
            <button
              type="button"
              onClick={() => choose("network")}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                focus === "network" ? "bg-white text-[var(--color-navy)]" : "text-white/80 hover:text-white"
              }`}
            >
              I need an expert
            </button>
          </div>
          {focus !== "both" && (
            <button
              type="button"
              onClick={() => setFocus("both")}
              className="link-underline mt-4 block w-full text-center text-xs text-white/60"
            >
              Show me both
            </button>
          )}
        </div>
      </section>

      <section
        id="deal-sourcing"
        className="bg-white py-24 transition-opacity duration-500 md:py-32"
        style={{ opacity: focus === "network" ? 0.35 : 1 }}
      >
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-charcoal)]">
              Service 01
            </p>
            <h2
              className="mb-6 text-3xl font-bold leading-tight text-[var(--color-navy)] md:text-4xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Private Equity Deal Sourcing
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
              I identify and qualify acquisition targets for private equity
              firms, search fund founders, and independent investors,
              whatever the intent behind the acquisition. Some clients want
              to acquire and operate a business for the long term. Others
              are folding a target into an existing platform, or pursuing a
              more specific strategy of their own. Either way, every search
              starts with your mandate, so what reaches you is a target
              worth your time, not a name pulled from a generic list.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {SOURCING_STEPS.map((step, i) => (
              <Reveal
                key={step.n}
                style={{ transitionDelay: `${i * 100}ms` }}
                className="rounded-xl border border-gray-100 bg-[var(--color-offwhite)] p-8"
              >
                <span
                  className="text-4xl font-black text-[var(--color-navy)]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {step.n}
                </span>
                <h3 className="mb-2 mt-4 text-lg font-semibold text-[var(--color-navy)]">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="expert-network"
        className="bg-[var(--color-offwhite)] py-24 transition-opacity duration-500 md:py-32"
        style={{ opacity: focus === "sourcing" ? 0.35 : 1 }}
      >
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-charcoal)]">
              Service 02
            </p>
            <h2
              className="mb-6 text-3xl font-bold leading-tight text-[var(--color-navy)] md:text-4xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Expert Introductions
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
              Every business hits a moment where the right outside expertise
              changes everything, and that expert could be anywhere: any
              field, any country. I find experts across all fields, globally,
              and go find the one who's solved your exact problem before,
              then work to arrange a call directly, so the right advice
              reaches the right problem fast, not after months of asking
              around.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {NETWORK_STEPS.map((step, i) => (
              <Reveal
                key={step.n}
                style={{ transitionDelay: `${i * 100}ms` }}
                className="rounded-xl border border-gray-100 bg-white p-8"
              >
                <span
                  className="text-4xl font-black text-[var(--color-navy)]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {step.n}
                </span>
                <h3 className="mb-2 mt-4 text-lg font-semibold text-[var(--color-navy)]">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.body}</p>
              </Reveal>
            ))}
          </div>

          <ExpertRequestForm />
        </div>
      </section>

      <section className="bg-white py-20 text-center">
        <Reveal className="mx-auto max-w-2xl px-6">
          <h2
            className="mb-4 text-2xl font-bold text-[var(--color-navy)] md:text-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Not sure which one you need?
          </h2>
          <p className="mb-8 text-gray-600">
            Tell me what you're working on, and I'll point you the right
            direction.
          </p>
          <a
            href="https://calendly.com/harshiitnemani/30min"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onBookingClick}
            className="btn-lift inline-block bg-[var(--color-navy)] px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-[var(--color-navy-light)]"
          >
            Book a Call
          </a>
        </Reveal>
      </section>
    </>
  );
}
