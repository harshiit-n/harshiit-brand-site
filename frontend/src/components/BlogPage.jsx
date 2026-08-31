import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Reveal from "./Reveal";
import { getPosts, getVideos } from "../lib/api";

function renderMarkdown(raw) {
  return { __html: DOMPurify.sanitize(marked.parse(raw)) };
}

export default function BlogPage() {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  useEffect(() => {
    Promise.all([getPosts(), getVideos()])
      .then(([posts, videos]) => {
        const combined = [
          ...posts.map((p) => ({ ...p, type: "post" })),
          ...videos.map((v) => ({ ...v, type: "video" })),
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setEntries(combined);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#12314f] via-[var(--color-navy)] to-[var(--color-navy-dark)] pt-32 pb-20 text-white md:pt-40 md:pb-28">
        <div className="grain-overlay" />
        <div className="pointer-events-none absolute right-[-10%] top-1/3 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] md:text-sm">
            Blog
          </p>
          <h1
            className="text-4xl font-bold leading-[1.05] md:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Notes From The Deal Room.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
            Writing and video updates on deal sourcing, the network, and what
            I'm seeing across PE, VC, and search funds.
          </p>
        </div>
      </section>

      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          {status === "loading" && (
            <p className="text-center text-sm text-gray-500">Loading...</p>
          )}

          {status === "error" && (
            <p className="text-center text-sm text-gray-500">
              Couldn't load the blog right now. Please check back shortly.
            </p>
          )}

          {status === "ready" && entries.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              Nothing here yet, check back soon.
            </p>
          )}

          {status === "ready" && entries.length > 0 && (
            <div className="grid gap-14">
              {entries.map((entry, i) => (
                <Reveal
                  key={`${entry.type}-${entry.id}`}
                  style={{ transitionDelay: `${Math.min(i, 4) * 80}ms` }}
                  className="border-b border-gray-100 pb-14 last:border-0"
                >
                  <h2
                    className="text-2xl font-bold text-[var(--color-navy)] md:text-3xl"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {entry.title}
                  </h2>

                  {entry.type === "post" ? (
                    <div
                      className="prose prose-neutral mt-5 max-w-none text-gray-700 prose-headings:text-[var(--color-navy)] prose-a:text-[var(--color-navy)]"
                      dangerouslySetInnerHTML={renderMarkdown(entry.body)}
                    />
                  ) : (
                    <>
                      <div className="mt-5 aspect-video w-full overflow-hidden rounded-xl bg-[var(--color-offwhite)]">
                        <iframe
                          className="h-full w-full"
                          src={`https://www.youtube-nocookie.com/embed/${entry.youtube_id}`}
                          title={entry.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      {entry.description && (
                        <p className="mt-4 text-sm leading-relaxed text-gray-600">{entry.description}</p>
                      )}
                    </>
                  )}
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
