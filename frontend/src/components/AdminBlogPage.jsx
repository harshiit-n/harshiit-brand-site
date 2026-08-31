import { useEffect, useState } from "react";
import {
  adminListVideos,
  adminCreateVideo,
  adminDeleteVideo,
  adminListPosts,
  adminCreatePost,
  adminDeletePost,
} from "../lib/api";

const STORAGE_KEY = "hn_admin_auth";
const EMPTY_POST = { title: "", body: "" };
const EMPTY_VIDEO = { title: "", url: "", description: "" };

export default function AdminBlogPage() {
  const [auth, setAuth] = useState(null);
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [posts, setPosts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const [postForm, setPostForm] = useState(EMPTY_POST);
  const [postStatus, setPostStatus] = useState("idle"); // "idle" | "loading" | "error"
  const [postError, setPostError] = useState("");

  const [videoForm, setVideoForm] = useState(EMPTY_VIDEO);
  const [videoStatus, setVideoStatus] = useState("idle");
  const [videoError, setVideoError] = useState("");

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
      const [postsData, videosData] = await Promise.all([
        adminListPosts({ user, pass }),
        adminListVideos({ user, pass }),
      ]);
      setAuth({ user, pass });
      setPosts(postsData);
      setVideos(videosData);
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
    setPosts([]);
    setVideos([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  async function refreshLists() {
    if (!auth) return;
    setListLoading(true);
    try {
      const [postsData, videosData] = await Promise.all([adminListPosts(auth), adminListVideos(auth)]);
      setPosts(postsData);
      setVideos(videosData);
    } finally {
      setListLoading(false);
    }
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    setPostStatus("loading");
    setPostError("");
    try {
      await adminCreatePost(postForm, auth);
      setPostForm(EMPTY_POST);
      setPostStatus("idle");
      await refreshLists();
    } catch (err) {
      setPostStatus("error");
      setPostError(err.message);
    }
  }

  async function handleCreateVideo(e) {
    e.preventDefault();
    setVideoStatus("loading");
    setVideoError("");
    try {
      await adminCreateVideo(videoForm, auth);
      setVideoForm(EMPTY_VIDEO);
      setVideoStatus("idle");
      await refreshLists();
    } catch (err) {
      setVideoStatus("error");
      setVideoError(err.message);
    }
  }

  async function handleDeletePost(id) {
    if (!confirm("Delete this post?")) return;
    await adminDeletePost(id, auth);
    setPosts((p) => p.filter((post) => post.id !== id));
  }

  async function handleDeleteVideo(id) {
    if (!confirm("Delete this video?")) return;
    await adminDeleteVideo(id, auth);
    setVideos((v) => v.filter((video) => video.id !== id));
  }

  const inputClass =
    "rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]";
  const btnClass =
    "btn-lift w-fit rounded-md bg-[var(--color-navy)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-navy-light)] disabled:opacity-60";

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
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[var(--color-navy)]">Manage Blog</h1>
          <button type="button" onClick={signOut} className="link-underline text-sm text-gray-500">
            Sign out
          </button>
        </div>

        <form
          onSubmit={handleCreatePost}
          className="mt-8 grid gap-4 rounded-xl border border-gray-100 bg-white p-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Add a blog post</h2>
          <input
            type="text"
            required
            placeholder="Title"
            value={postForm.title}
            onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
            className={inputClass}
          />
          <textarea
            required
            rows={8}
            placeholder="Write in Markdown: **bold**, # Heading, - list item, [link](https://...)"
            value={postForm.body}
            onChange={(e) => setPostForm({ ...postForm, body: e.target.value })}
            className={`resize-y font-mono ${inputClass}`}
          />
          <button type="submit" disabled={postStatus === "loading"} className={btnClass}>
            {postStatus === "loading" ? "Publishing..." : "Publish post"}
          </button>
          {postStatus === "error" && <p className="text-sm font-medium text-red-600">{postError}</p>}
        </form>

        <form
          onSubmit={handleCreateVideo}
          className="mt-6 grid gap-4 rounded-xl border border-gray-100 bg-white p-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Add a video</h2>
          <input
            type="text"
            required
            placeholder="Title"
            value={videoForm.title}
            onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
            className={inputClass}
          />
          <input
            type="url"
            required
            placeholder="YouTube link (e.g. https://youtu.be/...)"
            value={videoForm.url}
            onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
            className={inputClass}
          />
          <textarea
            rows={3}
            placeholder="Description (optional)"
            value={videoForm.description}
            onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
            className={`resize-none ${inputClass}`}
          />
          <button type="submit" disabled={videoStatus === "loading"} className={btnClass}>
            {videoStatus === "loading" ? "Adding..." : "Add video"}
          </button>
          {videoStatus === "error" && <p className="text-sm font-medium text-red-600">{videoError}</p>}
        </form>

        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {listLoading ? "Loading..." : `${posts.length} post${posts.length === 1 ? "" : "s"}`}
          </h2>
          <div className="mt-4 grid gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white px-4 py-3"
              >
                <p className="truncate text-sm font-medium text-[var(--color-navy)]">{post.title}</p>
                <button
                  type="button"
                  onClick={() => handleDeletePost(post.id)}
                  className="link-underline shrink-0 text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {listLoading ? "Loading..." : `${videos.length} video${videos.length === 1 ? "" : "s"}`}
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
                  onClick={() => handleDeleteVideo(video.id)}
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
