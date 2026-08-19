export default function Footer() {
  const YEAR = new Date().getFullYear();
  return (
    <footer className="bg-[var(--color-navy)] text-white/70 py-12">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <p className="text-white font-semibold text-lg">Harshiit Nemani</p>
          <p className="text-sm mt-1">Deal sourcing for PE, VC &amp; search funds.</p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#vision" className="hover:text-white transition-colors">The Vision</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div className="flex gap-4 text-sm">
          <a
            href="https://www.linkedin.com/in/harshiit-nemani55519623b"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a href="mailto:harshiitnemani@gmail.com" className="hover:text-white transition-colors">
            Email
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/50">
        <p>© {YEAR} Harshiit Nemani. All rights reserved.</p>
        <div className="flex gap-4">
          {/* Placeholder anchors — replace with real Privacy Policy / Terms pages; have a lawyer review before launch. */}
          <a href="#" className="hover:text-white/80">Privacy Policy</a>
          <a href="#" className="hover:text-white/80">Terms</a>
        </div>
      </div>
    </footer>
  );
}
