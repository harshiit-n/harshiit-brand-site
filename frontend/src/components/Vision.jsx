import { useState } from "react";
import Reveal from "./Reveal";
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
    <section id="vision" className="py-24 bg-[var(--color-navy)] text-white">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase bg-white/10 text-[var(--color-gold)] px-3 py-1 rounded-full mb-6">
            Coming Soon
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            What I'm Building: A Deal Flow &amp; Expert Network
          </h2>
          <p className="text-white/80 leading-relaxed mb-10">
            Right now, most sourcing happens the hard way — cold outreach,
            fragmented broker lists, and months of manual qualification. I'm
            building a repository that connects the right acquisition
            targets with the right investors — and just as importantly,
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
            <p className="text-[var(--color-gold)] font-medium">
              You're on the list — thanks for the early interest.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="text"
                required
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-4 py-3 rounded-md text-gray-900 text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
              />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="px-4 py-3 rounded-md text-gray-900 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {status === "loading" ? "Submitting..." : "Get Early Access"}
              </button>
            </form>
          )}
          {status === "error" && <p className="text-red-300 text-sm mt-3">{error}</p>}
        </Reveal>
      </div>
    </section>
  );
}
