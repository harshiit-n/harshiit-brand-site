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
    <section className="relative overflow-hidden py-16 bg-[var(--color-navy)]">
      <div className="grain-overlay" />
      <Reveal className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          Get sourcing insights, straight from the deal room.
        </h2>
        <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
          Occasional notes on deal origination, market activity across
          PE/VC/search funds, and what I'm learning building the network.
        </p>

        {status === "success" ? (
          <p className="text-white font-medium">Thanks, you're subscribed.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-md bg-white text-gray-900 text-sm w-full sm:w-72 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-light)]"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-lift bg-white text-[var(--color-navy)] font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "Submitting..." : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && <p className="text-white font-medium text-sm mt-3">{error}</p>}
      </Reveal>
    </section>
  );
}
