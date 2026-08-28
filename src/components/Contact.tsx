import { useState, type FormEvent } from "react";
import { PlaySquare, Newspaper, Camera, Link2, Mail, AtSign, CheckCircle2 } from "lucide-react";
import SectionReveal from "./SectionReveal";

// 폼 제출은 Google Apps Script 웹 앱으로 갑니다. 배포한 웹 앱 URL을
// .env 파일에 VITE_APPS_SCRIPT_URL=https://script.google.com/... 로 넣어주세요.
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined;

const EMAIL = "ejrfla21@kakao.com";

const CHANNELS = [
  {
    icon: Newspaper,
    label: "Blog",
    href: "https://blog.naver.com/duckkonni",
  },
  {
    icon: Camera,
    label: "Instagram",
    href: "https://www.instagram.com/duck.onni",
  },
  {
    icon: PlaySquare,
    label: "YouTube",
    href: "https://youtube.com/@tv-im7so",
  },
  {
    icon: AtSign,
    label: "Threads",
    href: "https://www.threads.com/@duck.onni",
  },
  {
    icon: Link2,
    label: "Linktree",
    href: "https://linktr.ee/oncoaching",
  },
];

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // ignore
    }
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!APPS_SCRIPT_URL) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const form = e.currentTarget;
    try {
      // Apps Script 웹 앱은 CORS 응답 헤더를 안 붙여줘서 no-cors로 보내고,
      // 네트워크 에러만 없으면 성공으로 간주합니다(응답 본문은 읽을 수 없음).
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: new FormData(form),
      });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-stretch gap-6 md:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-6">
            <SectionReveal className="text-center md:pl-4 md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-deep">
                강연 · 코칭 · 교육
              </p>
              <h2 className="mt-3 text-balance text-3xl font-bold text-ink md:text-4xl">
                언제든 편하게 문의하세요
              </h2>
              <p className="mt-3 text-pretty break-keep text-sm text-ink-soft md:text-base">
                기관·기업의 교육 목적과 대상에 맞춰
                <br />
                커리큘럼을 함께 설계해 드립니다.
              </p>
            </SectionReveal>

            <SectionReveal delay={0.1} className="flex-1">
              <div className="glass-card flex h-full flex-col justify-center rounded-3xl p-8">
                <h3 className="text-base font-bold text-ink">온라인에서도 만나요</h3>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="group flex w-full flex-col items-center gap-1.5 rounded-2xl bg-ivory/70 px-1 py-3 transition-all hover:-translate-y-0.5 hover:bg-ivory"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-deep transition-colors group-hover:bg-terracotta group-hover:text-ivory">
                        <Mail size={15} strokeWidth={2.2} />
                      </span>
                      <span className="text-xs font-bold text-ink">Email</span>
                    </button>
                    {emailCopied && (
                      <span className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-ivory shadow-lg">
                        이메일 주소가 복사되었습니다
                      </span>
                    )}
                  </div>

                  {CHANNELS.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-1.5 rounded-2xl bg-ivory/70 px-1 py-3 transition-all hover:-translate-y-0.5 hover:bg-ivory"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-deep transition-colors group-hover:bg-terracotta group-hover:text-ivory">
                        <Icon size={15} strokeWidth={2.2} />
                      </span>
                      <span className="text-xs font-bold text-ink">{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>

          <SectionReveal delay={0.15}>
            <form onSubmit={handleSubmit} className="glass-card h-full rounded-3xl p-8">
              {status === "sent" ? (
                <div className="flex h-full min-h-72 flex-col items-center justify-center gap-3 text-center">
                  <CheckCircle2 size={38} className="text-terracotta-deep" />
                  <p className="font-bold text-ink">문의가 접수되었습니다</p>
                  <p className="text-sm text-ink-soft">빠른 시일 내에 회신드리겠습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="이름" name="name" required />
                    <Field label="소속 기관" name="organization" required />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="전화번호" name="phone" type="tel" required />
                    <Field label="이메일" name="email" type="email" required />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-ink-soft">
                      문의 내용
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      className="w-full rounded-xl border border-ink/30 bg-ivory/70 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-terracotta/50"
                      placeholder="희망 교육 대상, 인원, 시기 등을 자유롭게 남겨주세요."
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-xs font-medium text-terracotta-deep">
                      {APPS_SCRIPT_URL
                        ? "전송에 실패했어요. 잠시 후 다시 시도해주세요."
                        : "문의 폼이 아직 연결되지 않았습니다. 관리자에게 문의해주세요."}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-ivory shadow-[0_16px_32px_-14px_rgba(196,116,76,0.6)] transition-transform hover:scale-[1.01] hover:bg-terracotta-deep disabled:opacity-60"
                  >
                    {status === "sending" ? "전송 중..." : "문의하기"}
                  </button>
                </div>
              )}
            </form>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink-soft">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-xl border border-ink/30 bg-ivory/70 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-terracotta/50"
      />
    </div>
  );
}
