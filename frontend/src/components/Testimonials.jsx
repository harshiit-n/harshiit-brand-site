import Reveal from "./Reveal";

// Placeholder testimonials only - swap these for real client quotes before
// launch. Deliberately not populated with invented names/firms.
const CARDS = [
  { quote: "[TESTIMONIAL PLACEHOLDER - swap in a real client quote before launch]", name: "[Client Name]", role: "[Title], [Firm]" },
  { quote: "[TESTIMONIAL PLACEHOLDER - swap in a real client quote before launch]", name: "[Client Name]", role: "[Title], [Firm]" },
  { quote: "[TESTIMONIAL PLACEHOLDER - swap in a real client quote before launch]", name: "[Client Name]", role: "[Title], [Firm]" },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <blockquote className="text-2xl md:text-3xl font-medium text-[var(--color-navy)] leading-snug">
            "[TESTIMONIAL PLACEHOLDER - swap in a real client quote before launch]"
          </blockquote>
          <p className="mt-4 text-gray-500 text-sm">[Client Name], [Title], [Firm]</p>
        </Reveal>
      </div>

      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-3 gap-6 mt-16">
        {CARDS.map((c, i) => (
          <Reveal
            key={i}
            style={{ transitionDelay: `${i * 100}ms` }}
            className="bg-[var(--color-offwhite)] rounded-xl p-6"
          >
            <p className="text-gray-600 text-sm leading-relaxed">{c.quote}</p>
            <p className="mt-4 text-sm font-medium text-[var(--color-navy)]">{c.name}</p>
            <p className="text-xs text-gray-400">{c.role}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
