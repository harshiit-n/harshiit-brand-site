import { useEffect, useState } from "react";
import { getTrackingReport, createTrackedMessage } from "../lib/trackingApi";

const STORAGE_KEY = "hn_tracking_admin_auth";
const EMPTY_FORM = { firm: "", name: "", email: "", source: "", country: "", campaign: "", variant: "" };

const EVENT_LABELS = {
  link_visited: "Visited link",
  email_opened: "Opened email",
  methodology_view: "Viewed How I Work",
  booking_link_clicked: "Clicked Book a Call",
  contact_submitted: "Submitted contact form",
  sample_view: "Viewed sample",
  sample_download_clicked: "Downloaded sample",
};

export default function AdminTrackingPage() {
  const [auth, setAuth] = useState(null);
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [report, setReport] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [formStatus, setFormStatus] = useState("idle"); // "idle" | "loading" | "error"
  const [formError, setFormError] = useState("");
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    signIn(parsed.user, parsed.pass, { silent: true });
  }, []);

  async function signIn(user, pass, { silent = false } = {}) {
    setLoginLoading(true);
    setLoginError("");
    try {
      const data = await getTrackingReport({ user, pass });
      setAuth({ user, pass });
      setReport(data.messages);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ user, pass }));
    } catch (err) {
      if (!silent) setLoginError(err.message);
      sessionStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    signIn(loginForm.user, loginForm.pass);
  }

  function signOut() {
    setAuth(null);
    setReport([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  async function refreshReport() {
    if (!auth) return;
    setReportLoading(true);
    try {
      const data = await getTrackingReport(auth);
      setReport(data.messages);
    } finally {
      setReportLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormStatus("loading");
    setFormError("");
    setLastResult(null);
    try {
      const result = await createTrackedMessage(form, auth);
      setLastResult(result);
      setForm((f) => ({ ...EMPTY_FORM, campaign: f.campaign, variant: f.variant }));
      setFormStatus("idle");
      await refreshReport();
    } catch (err) {
      setFormStatus("error");
      setFormError(err.message);
    }
  }

  function copy(text) {
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  const inputClass =
    "rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]";
  const btnClass =
    "btn-lift w-fit rounded-md bg-[var(--color-navy)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-navy-light)] disabled:opacity-60";

  if (!auth) {
    return (
      <section className="min-h-screen bg-[var(--color-offwhite)] px-6 pt-32 pb-20">
        <div className="mx-auto max-w-sm">
          <h1 className="text-xl font-semibold text-[var(--color-navy)]">Tracking admin sign in</h1>
          <form onSubmit={handleLoginSubmit} className="mt-6 grid gap-4">
            <input
              type="text"
              required
              placeholder="Username"
              value={loginForm.user}
              onChange={(e) => setLoginForm({ ...loginForm, user: e.target.value })}
              className={inputClass}
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={loginForm.pass}
              onChange={(e) => setLoginForm({ ...loginForm, pass: e.target.value })}
              className={inputClass}
            />
            <button type="submit" disabled={loginLoading} className={btnClass}>
              {loginLoading ? "Signing in..." : "Sign in"}
            </button>
            {loginError && <p className="text-sm font-medium text-red-600">{loginError}</p>}
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--color-offwhite)] px-6 pt-32 pb-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[var(--color-navy)]">Outreach Tracking</h1>
          <button type="button" onClick={signOut} className="link-underline text-sm text-gray-500">
            Sign out
          </button>
        </div>

        <form onSubmit={handleCreate} className="mt-8 grid gap-4 rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Generate a tracked link for a new email
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Firm"
              value={form.firm}
              onChange={(e) => setForm({ ...form, firm: e.target.value })}
              className={inputClass}
            />
            <input
              type="text"
              required
              placeholder="Contact name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Source (e.g. LinkedIn)"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className={inputClass}
            />
            <input
              type="text"
              required
              placeholder="Campaign (e.g. uk_pe_sep_2026)"
              value={form.campaign}
              onChange={(e) => setForm({ ...form, campaign: e.target.value })}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Variant (e.g. sample_offer_a)"
              value={form.variant}
              onChange={(e) => setForm({ ...form, variant: e.target.value })}
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={formStatus === "loading"} className={btnClass}>
            {formStatus === "loading" ? "Generating..." : "Generate link"}
          </button>
          {formStatus === "error" && <p className="text-sm font-medium text-red-600">{formError}</p>}
        </form>

        {lastResult && (
          <div className="mt-4 rounded-xl border border-gray-100 bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Paste these into the email
            </h3>
            <div className="mt-4 grid gap-3">
              <div>
                <p className="text-xs text-gray-500">Tracked link (use as your CTA / signature link)</p>
                <div className="mt-1 flex gap-2">
                  <input readOnly value={lastResult.link} className={`${inputClass} flex-1 bg-gray-50`} />
                  <button type="button" onClick={() => copy(lastResult.link)} className="rounded-md border border-gray-300 px-3 text-sm hover:bg-gray-50">
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  Open-tracking pixel — in Gmail: Insert &gt; Image &gt; Web address, paste the URL below.
                  Approximate only (Gmail proxies/caches images) — treat it as a signal, not a certainty.
                </p>
                <div className="mt-1 flex gap-2">
                  <input readOnly value={lastResult.pixel_url} className={`${inputClass} flex-1 bg-gray-50`} />
                  <button type="button" onClick={() => copy(lastResult.pixel_url)} className="rounded-md border border-gray-300 px-3 text-sm hover:bg-gray-50">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {reportLoading ? "Loading..." : `${report.length} tracked message${report.length === 1 ? "" : "s"}`}
          </h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Firm / Contact</th>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Activity via this recipient's link</th>
                </tr>
              </thead>
              <tbody>
                {report.map((row) => (
                  <tr key={row.message_id} className="border-b border-gray-50 align-top last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--color-navy)]">{row.firm}</p>
                      <p className="text-xs text-gray-500">{row.name}</p>
                      {row.do_not_contact && (
                        <p className="mt-1 text-xs font-medium text-red-600">Do not contact</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p>{row.campaign}</p>
                      {row.variant && <p className="text-xs text-gray-500">{row.variant}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(row.sent_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {row.events.length === 0 ? (
                        <span className="text-xs text-gray-400">No activity yet</span>
                      ) : (
                        <ul className="space-y-1">
                          {row.events.map((ev, i) => (
                            <li key={i} className="text-xs text-gray-600">
                              {EVENT_LABELS[ev.event_name] || ev.event_name}
                              {ev.confidence === "approximate" && " (approximate)"}
                              {" — "}
                              {new Date(ev.received_at).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
