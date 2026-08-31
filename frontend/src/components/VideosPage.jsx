import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { getVideos } from "../lib/api";

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  useEffect(() => {
    getVideos()
      .then((data) => {
        setVideos(data);
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
            Vlogs
          </p>
          <h1
            className="text-4xl font-bold leading-[1.05] md:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Notes From The Deal Room, On Video.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
            Short updates on deal sourcing, the network, and what I'm seeing
            across PE, VC, and search funds.
          </p>
        </div>
      </section>

      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          {status === "loading" && (
            <p className="text-center text-sm text-gray-500">Loading videos...</p>
          )}

          {status === "error" && (
            <p className="text-center text-sm text-gray-500">
              Couldn't load videos right now. Please check back shortly.
            </p>
          )}

          {status === "ready" && videos.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No videos yet, check back soon.
            </p>
          )}

          {status === "ready" && videos.length > 0 && (
            <div className="grid gap-10 md:grid-cols-2">
              {videos.map((video, i) => (
                <Reveal
                  key={video.id}
                  style={{ transitionDelay: `${(i % 2) * 100}ms` }}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-[var(--color-offwhite)]"
                >
                  <div className="aspect-video w-full">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${video.youtube_id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--color-navy)]">{video.title}</h3>
                    {video.description && (
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">{video.description}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
