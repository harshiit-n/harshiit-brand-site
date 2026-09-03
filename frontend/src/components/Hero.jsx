import headshotCutout from "../assets/headshot-cutout-tight.png";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex items-center overflow-hidden bg-gradient-to-br from-[#12314f] via-[var(--color-navy)] to-[var(--color-navy-dark)] pt-16 text-white md:min-h-screen"
    >
      <div className="grain-overlay" />

      {/* Soft glow behind the photo, for depth against the dark background */}
      <div className="pointer-events-none absolute right-[8%] top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

      {/* Background removed from the source photo, so he stands directly
          against the hero's own navy, no frame or mask needed. Sized by
          width and top-aligned so it reads as a close, dominant presence;
          any overflow gets cropped from the bottom (waist), never the head. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] items-start justify-center overflow-hidden md:flex">
        <img
          src={headshotCutout}
          alt="Harshiit Nemani"
          className="mt-10 w-[70%] object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 md:py-32">
        <div className="max-w-xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] md:text-sm">
            Deal Sourcing for PE, VC &amp; Search Funds
          </p>
          <h1
            className="mb-6 text-4xl font-bold leading-[1.05] md:text-6xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Finding the Right Targets, Faster.
          </h1>
          <p className="mb-10 max-w-md text-lg text-white/75">
            I help investors and search fund founders cut months off their
            sourcing timeline, with vetted, thesis-matched acquisition
            targets ready for diligence.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://calendly.com/harshiitnemani/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lift inline-block bg-[var(--color-accent)] px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[var(--color-accent-dark)]"
            >
              Book a Call
            </a>
            <a href="#about" className="link-underline inline-block text-sm font-medium text-white">
              Learn more about me
            </a>
          </div>

          {/* Mobile photo: standalone cutout centered below the text. */}
          <div className="mt-12 flex justify-center md:hidden">
            <img src={headshotCutout} alt="Harshiit Nemani" className="h-64 w-auto object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
