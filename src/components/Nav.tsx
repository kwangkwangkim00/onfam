import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#philosophy", label: "강의 분야" },
  { href: "#reviews", label: "강의 후기" },
  { href: "#record", label: "함께한 기관" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card border-x-0 border-t-0 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-semibold tracking-tight text-ink">
          <span className="text-terracotta">On</span>가족코칭센터
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-terracotta"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-ivory shadow-[0_10px_24px_-10px_rgba(196,116,76,0.6)] transition-transform hover:scale-[1.03] hover:bg-terracotta-deep"
          >
            섭외 문의
          </a>
        </nav>

        <button
          className="md:hidden text-ink"
          aria-label="메뉴 열기"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="glass-card mx-4 mt-3 flex flex-col gap-1 rounded-2xl p-4 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-ivory-deep hover:text-terracotta"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg bg-terracotta px-3 py-2.5 text-center text-sm font-semibold text-ivory"
          >
            섭외 문의
          </a>
        </div>
      )}
    </header>
  );
}
