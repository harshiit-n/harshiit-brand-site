import { Link } from "react-router-dom";

export default function Footer() {
  const YEAR = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-[var(--color-navy)] text-white/70 py-12">
      <div className="grain-overlay" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <p className="text-4xl leading-none text-white" style={{ fontFamily: "var(--font-signature)" }}>
            Harshiit Nemani
          </p>
          <p className="text-sm mt-2">Deal sourcing for PE, VC &amp; search funds.</p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          <Link to="/#about" className="link-underline inline-block hover:text-white transition-colors">About</Link>
          <Link to="/services" className="link-underline inline-block hover:text-white transition-colors">Services</Link>
          <Link to="/#how-it-works" className="link-underline inline-block hover:text-white transition-colors">How I Work</Link>
          <Link to="/#vision" className="link-underline inline-block hover:text-white transition-colors">The Vision</Link>
          <Link to="/#contact" className="link-underline inline-block hover:text-white transition-colors">Contact</Link>
        </div>

        <div className="flex gap-4 text-sm">
          <a
            href="https://www.linkedin.com/in/harshiitnemani"
            target="_blank"
            rel="noreferrer"
            className="link-underline inline-block hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a href="mailto:harshiitnemani@gmail.com" className="link-underline inline-block hover:text-white transition-colors">
            Email
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/50">
        <p>© {YEAR} Harshiit Nemani. All rights reserved.</p>
        <div className="flex gap-4">
          {/* Placeholder anchors - replace with real Privacy Policy / Terms pages; have a lawyer review before launch. */}
          <a href="#" className="hover:text-white/80">Privacy Policy</a>
          <a href="#" className="hover:text-white/80">Terms</a>
        </div>
      </div>
    </footer>
  );
}
