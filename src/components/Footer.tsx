export default function Footer() {
  return (
    <footer className="py-6">
      <div className="mx-auto max-w-6xl px-6">
        <div className="hairline mb-5" />
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm font-semibold text-ink">
            On<span className="text-terracotta">가족코칭센터</span>
          </p>
          <p className="text-xs text-ink-soft">
            대표강사 이덕림 ·{" "}
            <a
              href="https://blog.naver.com/duckkonni"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-terracotta-deep"
            >
              blog.naver.com/duckkonni
            </a>{" "}
            ·{" "}
            <a
              href="https://www.instagram.com/duck.onni"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-terracotta-deep"
            >
              @duck.onni
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
