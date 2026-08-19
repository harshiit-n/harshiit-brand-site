import { useState } from "react";
import Reveal from "./Reveal";
import { submitNewsletter } from "../lib/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await submitNewsletter({ email });
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <section className="py-16 bg-[var(--color-gold)]">
      <Reveal className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-navy)] mb-2">
          Get sourcing insights, straight from the deal room.
        </h2>
        <p className="text-[var(--color-navy)]/80 text-sm mb-6 max-w-md mx-auto">
          Occasional notes on deal origination, market activity across
          PE/VC/search funds, and what I'm learning building the network.
        </p>

        {status === "success" ? (
          <p className="text-[var(--color-navy)] font-medium">Thanks — you're subscribed.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-md text-gray-900 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-[var(--color-navy)] text-white font-semibold px-6 py-3 rounded-md hover:bg-[var(--color-navy-light)] transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "Submitting..." : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && <p className="text-red-900 text-sm mt-3">{error}</p>}
      </Reveal>
    </section>
  );
}
