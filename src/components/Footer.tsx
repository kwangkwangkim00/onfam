export default function Footer() {
  return (
    <footer className="py-6">
      <div className="mx-auto max-w-6xl px-6">
        <div className="hairline mb-5" />
        <div className="flex flex-col items-center gap-3 text-center md:grid md:grid-cols-3 md:items-center md:gap-4 md:text-left">
          <p className="text-sm font-semibold text-ink md:text-left">
            <span className="text-terracotta">On</span>가족코칭센터
            <span className="ml-2 text-xs font-normal text-ink-soft">
              사업자등록번호 : 781-24-02025
            </span>
          </p>
          <p className="text-[11px] text-ink-soft/70 md:text-center">
            Copyright ⓒ 2026 Oncoaching. All rights reserved.
          </p>
          <p className="text-xs text-ink-soft md:text-right">
            대표강사 이덕림{" "}
            <a href="tel:010-2031-1708" className="transition-colors hover:text-terracotta-deep">
              010-2031-1708
            </a>{" "}
            /{" "}
            <a
              href="mailto:ejrfla21@kakao.com"
              className="transition-colors hover:text-terracotta-deep"
            >
              ejrfla21@kakao.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
