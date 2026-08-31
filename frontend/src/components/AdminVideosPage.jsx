import { useEffect, useState } from "react";
import { adminListVideos, adminCreateVideo, adminDeleteVideo } from "../lib/api";

const STORAGE_KEY = "hn_admin_auth";
const EMPTY_FORM = { title: "", url: "", description: "" };

export default function AdminVideosPage() {
  const [auth, setAuth] = useState(null);
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [formStatus, setFormStatus] = useState("idle"); // "idle" | "loading" | "error"
  const [formError, setFormError] = useState("");

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
      const data = await adminListVideos({ user, pass });
      setAuth({ user, pass });
      setVideos(data);
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
    setVideos([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  async function refreshVideos() {
    if (!auth) return;
    setVideosLoading(true);
    try {
      setVideos(await adminListVideos(auth));
    } finally {
      setVideosLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormStatus("loading");
    setFormError("");
    try {
      await adminCreateVideo(form, auth);
      setForm(EMPTY_FORM);
      setFormStatus("idle");
      await refreshVideos();
    } catch (err) {
      setFormStatus("error");
      setFormError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this video?")) return;
    await adminDeleteVideo(id, auth);
    setVideos((v) => v.filter((video) => video.id !== id));
  }

  if (!auth) {
    return (
      <section className="min-h-screen bg-[var(--color-offwhite)] px-6 pt-32 pb-20">
        <div className="mx-auto max-w-sm">
          <h1 className="text-xl font-semibold text-[var(--color-navy)]">Admin sign in</h1>
          <form onSubmit={handleLoginSubmit} className="mt-6 grid gap-4">
            <input
              type="text"
              required
              placeholder="Username"
              value={loginForm.user}
              onChange={(e) => setLoginForm({ ...loginForm, user: e.target.value })}
              className="rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={loginForm.pass}
              onChange={(e) => setLoginForm({ ...loginForm, pass: e.target.value })}
              className="rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
            />
            <button
              type="submit"
              disabled={loginLoading}
              className="btn-lift w-fit rounded-md bg-[var(--color-navy)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-navy-light)] disabled:opacity-60"
            >
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
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[var(--color-navy)]">Manage Vlogs</h1>
          <button type="button" onClick={signOut} className="link-underline text-sm text-gray-500">
            Sign out
          </button>
        </div>

        <form
          onSubmit={handleCreate}
          className="mt-8 grid gap-4 rounded-xl border border-gray-100 bg-white p-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Add a video</h2>
          <input
            type="text"
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
          />
          <input
            type="url"
            required
            placeholder="YouTube link (e.g. https://youtu.be/...)"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
          />
          <textarea
            rows={3}
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="resize-none rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
          />
          <button
            type="submit"
            disabled={formStatus === "loading"}
            className="btn-lift w-fit rounded-md bg-[var(--color-navy)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-navy-light)] disabled:opacity-60"
          >
            {formStatus === "loading" ? "Adding..." : "Add video"}
          </button>
          {formStatus === "error" && <p className="text-sm font-medium text-red-600">{formError}</p>}
        </form>

        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {videosLoading ? "Loading..." : `${videos.length} video${videos.length === 1 ? "" : "s"}`}
          </h2>
          <div className="mt-4 grid gap-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--color-navy)]">{video.title}</p>
                  <p className="truncate text-xs text-gray-500">{video.youtube_id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(video.id)}
                  className="link-underline shrink-0 text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
