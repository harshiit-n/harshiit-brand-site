import { useState } from "react";
import Reveal from "./Reveal";
import { submitContact } from "../lib/api";

const EMPTY = { name: "", email: "", firm: "", message: "" };

export default function ExpertRequestForm() {
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
    <Reveal
      style={{ transitionDelay: "300ms" }}
      className="mt-14 rounded-xl border border-gray-100 bg-white p-8 md:p-10"
    >
      <h3 className="text-lg font-semibold text-[var(--color-navy)]">Looking for an expert?</h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
        Tell me what you're stuck on and who you wish you had on the phone.
        I'll look across my network and come back to you directly.
      </p>

      {status === "success" ? (
        <p className="mt-6 font-medium text-[var(--color-navy)]">
          Got it, I'll be in touch once I've found the right person.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Name"
              value={form.name}
              onChange={update("name")}
              className="rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={update("email")}
              className="rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
            />
          </div>
          <input
            type="text"
            placeholder="Company (optional)"
            value={form.firm}
            onChange={update("firm")}
            className="rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
          />
          <textarea
            required
            rows={4}
            placeholder="What do you need help with, and what would the right expert look like?"
            value={form.message}
            onChange={update("message")}
            className="resize-none rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-lift w-fit rounded-md bg-[var(--color-navy)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-navy-light)] disabled:opacity-60"
          >
            {status === "loading" ? "Sending..." : "Submit Details"}
          </button>
          {status === "error" && <p className="text-sm font-medium text-[var(--color-charcoal)]">{error}</p>}
        </form>
      )}
    </Reveal>
  );
}
