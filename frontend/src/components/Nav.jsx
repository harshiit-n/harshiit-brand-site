import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Monogram from "./Monogram";

const LINKS = [
  { to: "/#about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/#how-it-works", label: "How I Work" },
  { to: "/#vision", label: "The Vision" },
  { to: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          aria-label="Harshiit Nemani, home"
          className={`transition-colors ${scrolled ? "text-[var(--color-charcoal)]" : "text-white"}`}
        >
          <Monogram className="h-9 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`link-underline inline-block text-sm transition-colors ${
                scrolled ? "text-gray-700 hover:text-[var(--color-navy)]" : "text-white/85 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://calendly.com/harshiitnemani/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-lift text-sm font-medium px-4 py-2 rounded-md transition-colors ${
              scrolled
                ? "bg-[var(--color-navy)] text-white hover:bg-[var(--color-navy-light)]"
                : "bg-white text-[var(--color-navy)] hover:bg-gray-100"
            }`}
          >
            Book a Call
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          className={`md:hidden transition-colors ${scrolled ? "text-[var(--color-navy)]" : "text-white"}`}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform duration-300 ease-out"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="link-underline inline-block w-fit text-sm text-gray-700"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://calendly.com/harshiitnemani/30min"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn-lift text-sm font-medium bg-[var(--color-navy)] text-white px-4 py-2 rounded-md text-center"
          >
            Book a Call
          </a>
        </div>
      )}
    </header>
  );
}
