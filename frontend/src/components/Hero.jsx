export default function Hero() {
  return (
    <section id="top" className="pt-36 pb-20 md:pt-44 md:pb-28 bg-[var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-gold)] uppercase mb-4">
            Deal Sourcing for PE, VC &amp; Search Funds
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-navy)] leading-tight mb-6">
            Finding the Right Targets, Faster.
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            I help investors and search fund founders cut months off their
            sourcing timeline — with vetted, thesis-matched acquisition
            targets ready for diligence.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#contact"
              className="inline-block bg-[var(--color-navy)] text-white font-medium px-6 py-3 rounded-md hover:bg-[var(--color-navy-light)] transition-colors"
            >
              Book a Call
            </a>
            <a href="#about" className="text-sm font-medium text-[var(--color-navy)] underline underline-offset-4">
              Learn more about me
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          {/* REPLACE WITH REAL HEADSHOT — recommended 800x1000px, professional/editorial style. */}
          <div className="w-72 h-96 rounded-xl bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-400 text-sm text-center px-6">
            Headshot placeholder
            <br />
            (800×1000px)
          </div>
        </div>
      </div>
    </section>
  );
}
