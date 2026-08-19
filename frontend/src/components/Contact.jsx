import { useState } from "react";
import Reveal from "./Reveal";
import { submitContact } from "../lib/api";

const EMPTY = { name: "", email: "", firm: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await submitContact(form);
      setStatus("success");
      setForm(EMPTY);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <h2 className="text-sm font-semibold tracking-[0.2em] text-[var(--color-gold)] uppercase mb-3 text-center">
            Contact
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-navy)] mb-2 text-center">
            Let's Talk Deal Flow
          </h3>
          <p className="text-gray-600 text-center mb-10">
            Tell me about your mandate — I'll follow up within 1 business day.
          </p>
        </Reveal>

        <Reveal>
          {status === "success" ? (
            <p className="text-center text-[var(--color-navy)] font-medium">
              Thanks — I'll be in touch shortly.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={form.name}
                  onChange={update("name")}
                  className="px-4 py-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={update("email")}
                  className="px-4 py-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                />
              </div>
              <input
                type="text"
                placeholder="Firm (optional)"
                value={form.firm}
                onChange={update("firm")}
                className="px-4 py-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
              />
              <textarea
                required
                rows={4}
                placeholder="Tell me about your mandate..."
                value={form.message}
                onChange={update("message")}
                className="px-4 py-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] resize-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[var(--color-navy)] text-white font-medium px-6 py-3 rounded-md hover:bg-[var(--color-navy-light)] transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
              {status === "error" && <p className="text-red-600 text-sm">{error}</p>}
            </form>
          )}
          <p className="text-center text-sm text-gray-400 mt-6">
            Or email directly:{" "}
            <a href="mailto:harshiitnemani@gmail.com" className="text-[var(--color-navy)] underline">
              harshiitnemani@gmail.com
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
