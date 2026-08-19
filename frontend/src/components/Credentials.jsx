import Reveal from "./Reveal";

const CREDENTIALS = [
  "CFA Level II Candidate",
  "PE Deal Sourcing & Valuation — DACH Region",
  "National Rank 3, Finopoly (IIM Indore) — 1,400+ Teams",
  "Business Consulting Experience, Ernst & Young",
];

export default function Credentials() {
  return (
    <section className="py-12 border-b border-gray-100">
      <Reveal className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {CREDENTIALS.map((c) => (
          <div key={c} className="text-center px-2">
            <p className="text-sm font-medium text-gray-700 leading-snug">{c}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
