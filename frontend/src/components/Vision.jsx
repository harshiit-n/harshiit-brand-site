import { useState } from "react";
import Reveal from "./Reveal";
import Monogram from "./Monogram";
import { submitWaitlist } from "../lib/api";

export default function Vision() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await submitWaitlist(form);
      setStatus("success");
      setForm({ name: "", email: "" });
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <section id="vision" className="relative overflow-hidden py-24 bg-[var(--color-navy)] text-white">
      <div className="grain-overlay" />

      {/* Watermark: the same monogram used in the nav, blown up huge and
          near-invisible, like a personal letterhead behind the section. */}
      <Monogram
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-auto -translate-x-1/2 -translate-y-1/2 select-none text-white"
        style={{ opacity: 0.06 }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            What I'm Building: A Deal Flow &amp; Expert Network
          </h2>
          <p className="text-white/80 leading-relaxed mb-10">
            Right now, most sourcing happens the hard way: cold outreach,
            fragmented broker lists, and months of manual qualification. I'm
            building a repository that connects the right acquisition
            targets with the right investors, and just as importantly,
            connects good businesses with the experts they need but rarely
            find: the M&amp;A lawyer who's seen their exact deal structure
            before, the operator who's scaled the same playbook, the
            advisor who's navigated the same diligence process. Every good
            business needs great expertise around it. The hard part has
            always been finding it. That's the network I'm building.
          </p>
        </Reveal>

        <Reveal>
          {status === "success" ? (
            <p className="text-white font-medium">
              You're in. I'll be in touch as the network grows.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="text"
                required
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-4 py-3 rounded-md bg-white text-gray-900 text-sm w-full sm:w-56 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
              />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="px-4 py-3 rounded-md bg-white text-gray-900 text-sm w-full sm:w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-lift bg-white text-[var(--color-navy)] font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Joining..." : "Join the Network"}
              </button>
            </form>
          )}
          {status === "error" && <p className="text-white font-medium text-sm mt-3">{error}</p>}
        </Reveal>
      </div>
    </section>
  );
}
