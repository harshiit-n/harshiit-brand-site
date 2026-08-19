import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="py-24">
      <Reveal className="mx-auto max-w-3xl px-6">
        <h2 className="text-sm font-semibold tracking-[0.2em] text-[var(--color-gold)] uppercase mb-3">
          Who is Harshiit?
        </h2>
        <div className="space-y-5 text-gray-700 leading-relaxed">
          <p>
            Harshiit Nemani is a finance professional who built his early
            career inside the deal room. As a Private Equity Analyst at a
            Mittelstand-focused advisory firm, he sourced and valued private
            companies across the DACH region — running financial due
            diligence and building structured investment memos for senior
            partner review. Before that, he sharpened his diligence
            instincts at Ernst &amp; Young, auditing treasury operations and
            forex/derivative controls for one of India's largest banks.
          </p>
          <p>
            He's a CFA Level II candidate with national top-5 finishes in
            two of India's most competitive finance case competitions —
            Finopoly at IIM Indore (Rank 3 of 1,400+ teams) and the Muvin
            National Finance Olympiad (Rank 4 of 80,000+ participants) — and
            previously led a university finance society, mentoring 15+
            students in investing and equity research alongside the CFA
            Institute.
          </p>
          <p>
            Today he runs a deal sourcing practice for PE firms, VC firms,
            and search fund entrepreneurs, built on a simple observation:
            most firms spend months, sometimes years, hunting for the right
            target — time that should be spent negotiating and closing
            instead. His mission is to build the infrastructure that
            connects the right targets with the right investors, and, over
            time, connects great businesses with the experts who can help
            them grow.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
