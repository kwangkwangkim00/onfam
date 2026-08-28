export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-6">
      <div className="mx-auto max-w-6xl px-6">
        <div className="hairline mb-5" />
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm font-semibold text-ink">
            <span className="text-terracotta">On</span>가족코칭센터
            <span className="ml-2 text-xs font-normal text-ink-soft">
              사업자등록번호 : 781-24-02025
            </span>
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
        <p className="mt-4 text-center text-[11px] text-ink-soft/70">
          Copyright ⓒ {year} Oncoaching. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
