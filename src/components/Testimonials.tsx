import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import SectionReveal from "./SectionReveal";

// src/assets/reviews/ 안에 1.jpg, 2.png ... 처럼 순서대로 번호만 붙여 넣으면
// 아래 REAL_REVIEWS 배열의 같은 순번 카드에 자동으로 사진이 들어갑니다.
const reviewPhotoFiles = import.meta.glob("../assets/reviews/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const reviewPhotos: Record<number, string> = {};
for (const [path, url] of Object.entries(reviewPhotoFiles)) {
  const n = Number(path.match(/(\d+)\.[a-z]+$/i)?.[1]);
  if (n) reviewPhotos[n] = url;
}

type Review = { org: string; topic: string; quote: string };

// blog.naver.com/duckkonni 출강 후기 원문에서 그대로(또는 같은 자리의 여러 문장을
// 이어 붙여) 가져온 인용문입니다. 참여자 실명은 없어 표기하지 않았습니다.
const REAL_REVIEWS: Review[] = [
  {
    org: "LG전자",
    topic: "부부 재무 관리",
    quote: "어떤 삶을 살고싶은지 큰그림을 그려보고 재무목표를 점검해보는게 큰 도움이 되었어요.",
  },
  {
    org: "현대엘리베이터",
    topic: "H-Family Day",
    quote: "몰랐던 서로의 속마음을 알아보는 소통의 시간이었어요.",
  },
  {
    org: "송파구 가족센터",
    topic: "다문화 부부교육",
    quote: "미안함과 짠함이 느껴진다. 따뜻함이 전해진다. 앞으로 더 자주 안아줘야겠다.",
  },
  {
    org: "시흥시 가족센터",
    topic: "생애주기 가족교육",
    quote: "사례 위주의 알찬 교육, 전문적이고 자세한 강의. 배우자의 감정을 알게 된 강의였어요.",
  },
  {
    org: "서울가족학교 (영등포구)",
    topic: "예비부부교실 · DISC",
    quote:
      "다르다고만 생각했던 상대의 모습이, 사실은 다르게 사랑을 표현하는 방식이었다는 걸 알게 되었어요.",
  },
  {
    org: "서울청년센터 (광진)",
    topic: "강점기반 SWOT분석 워크숍",
    quote: "참여도와 만족도가 기대 이상으로 높았어요.",
  },
  {
    org: "강동구 가족센터",
    topic: "예비부부교실",
    quote: "막연하게만 느껴졌던 결혼 생활이, 이제는 조금씩 선명하게 그려지는 것 같아요.",
  },
  {
    org: "춘천시 가족센터",
    topic: "애착유형 부부소통강의",
    quote:
      "내가 이 사람과 끝까지 함께하는 이유가 '연민'이었음을 깨달았습니다. 상대방의 감정을 살피고 이해하며, 불안하지 않게 사랑 표현을 더 많이 하려고요.",
  },
  {
    org: "성북구 가족센터",
    topic: "신혼부부 재무교육",
    quote:
      "4가지 돈의 의미, 가치관 이야기, 재무계획의 전체적인 틀까지 짚어주셔서 — 앞으로 어떻게 재무계획을 해나가야 할지 생각해볼 수 있는 계기가 되었습니다.",
  },
  {
    org: "해운대구건강가정지원센터 (부산)",
    topic: "DISC & 대화법",
    quote:
      "예전엔 왜 저래, 왜 이렇게 느려, 왜 말이 없어 하고 닦달했는데, 이제는 여유를 갖고 기다려줘야겠다는 생각이 들어요. 앞으로 큰 도움이 될 것 같습니다.",
  },
  {
    org: "서울청년센터 (도봉)",
    topic: "DISC 워크숍",
    quote:
      "막연하게 다르다고만 생각했는데, 이해가 되는 순간 다름에서 오는 차이였다는 걸 배웠어요.",
  },
  {
    org: "서울중구가족센터",
    topic: "예비부부교실 · CARE시스템",
    quote: "재무 부분은 늘 어렵고 취약했는데 도움이 많이 되었습니다. CARE시스템도 꼭 해볼게요!",
  },
  {
    org: "성남시 가족센터",
    topic: "결혼준비학교",
    quote:
      "내가 이런 식으로 말하고 있었구나, 상대방에게는 이렇게 들릴 수도 있었겠구나 라는 걸 깨닫게 되었어요.",
  },
  {
    org: "서울중구가족센터",
    topic: "예비부부교실 (Zoom)",
    quote: "둘이 조용한 공간에서 마주 앉아 교육을 들으니, 정말 대화에 몰입할 수 있었어요.",
  },
  {
    org: "강남구 가족센터",
    topic: "예비부부교실 여름학기",
    quote:
      "서로 조율해야 할 것들이 생각보다 많다는 걸 알게 된 소중한 시간이었습니다. 미래를 함께할 사람을 위해 더 좋은 내가 되려면 무엇을 해야 할지 알 수 있었어요.",
  },
  {
    org: "시흥시 매화청소년문화센터",
    topic: "청소년 리더십 특강",
    quote: "난 조용한 성격이라 리더가 아니라고 생각했는데, 섬김형이라는 걸 처음 알았어요.",
  },
  {
    org: "인천 남동구 가족센터",
    topic: "예비신혼부부 재무교육",
    quote: "오늘 강의를 듣고 남편이 먼저 '우리 앞으로 어떻게 관리할까?' 하고 물어보더라고요.",
  },
  {
    org: "서울가족학교",
    topic: "예비신혼부부 교육효과 분석",
    quote:
      "예전엔 갈등이 생기면 서로 회피하는 패턴이었는데, 대화법을 배우고 나니 자신감이 생겨 대화를 이어가며 갈등을 풀어가는 패턴이 생겼습니다.",
  },
  {
    org: "서울가족학교 (영등포구)",
    topic: "예비부부교실 · 재무관리",
    quote:
      "재무 관리를 잘한다고 생각했는데 정말 생각지도 못한 부분들까지 짚어주셔서 정말 감사합니다. 저희 결혼생활 멘토는 이덕림 강사님이세요.",
  },
  {
    org: "강원특별자치도 공무원교육원",
    topic: "핵심리더과정 · 부부소통강의",
    quote:
      "아, 우리가 이래서 달랐구나 라는 걸 깨닫게 되었어요. 서로 다른 방식을 이해하고 나니, 앞으로는 조금 더 배려하며 대화하고 싶어졌습니다.",
  },
];

// 자동으로 흐르는 느낌을 내려고 카드 목록을 이어붙여요(끝에 닿으면 다시 처음이 아니라
// 똑같은 두 번째 세트로 자연스럽게 넘어가게).
const REVIEWS = [...REAL_REVIEWS, ...REAL_REVIEWS];

const AUTO_SPEED_PX_PER_MS = 0.09; // 카드 한 장이 약 4초에 지나가는 속도
const RESUME_DELAY_MS = 1800;

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef<{ startX: number; startScroll: number; dragging: boolean }>({
    startX: 0,
    startScroll: 0,
    dragging: false,
  });

  const pauseFor = (ms: number) => {
    pausedRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, ms);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();
    // 브라우저가 scrollLeft를 정수 픽셀로 반올림해버려서, 매 프레임 그 값을
    // 다시 읽어 더하면 소수점 이동량이 씹히며 흔들려 보입니다. 그래서 실제
    // 위치는 이 소수점 변수로만 추적하고, 화면에는 결과만 반영합니다.
    let virtualLeft = el.scrollLeft;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!pausedRef.current && !drag.current.dragging) {
        const setWidth = el.scrollWidth / 2;
        virtualLeft += AUTO_SPEED_PX_PER_MS * dt;
        if (virtualLeft >= setWidth) {
          virtualLeft -= setWidth;
        }
        el.scrollLeft = virtualLeft;
      } else {
        // 드래그/일시정지 중 사용자가 위치를 바꿨을 수 있으니 동기화해서,
        // 자동 재생이 다시 시작될 때 갑자기 튀지 않게 합니다.
        virtualLeft = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
    pauseFor(RESUME_DELAY_MS);
  };

  const onWheel = (e: React.WheelEvent) => {
    const el = trackRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
      pauseFor(RESUME_DELAY_MS);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { startX: e.clientX, startScroll: el.scrollLeft, dragging: true };
    el.setPointerCapture(e.pointerId);
    pausedRef.current = true;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || !drag.current.dragging) return;
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  };
  const endDrag = () => {
    if (!drag.current.dragging) return;
    drag.current.dragging = false;
    pauseFor(RESUME_DELAY_MS);
  };

  return (
    <section id="reviews" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionReveal className="mb-10 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-deep">
            강의 후기
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-ink md:text-4xl">
            함께한 분들의 이야기
          </h2>
          <p className="mt-2 whitespace-nowrap text-[11px] text-ink-soft sm:text-sm">
            실제로 함께한 기업과 기관, 참여자들이 전해주신 이야기입니다.
          </p>
        </SectionReveal>
      </div>

      <SectionReveal delay={0.1}>
        <div className="group/carousel relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-ivory to-transparent md:w-24"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-ivory to-transparent md:w-24"
          />

          <div
            ref={trackRef}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            className="no-scrollbar flex cursor-grab items-start gap-4 overflow-x-auto px-6 pb-4 active:cursor-grabbing md:mx-auto md:max-w-6xl"
          >
            {REVIEWS.map((r, i) => {
              const photo = reviewPhotos[(i % REAL_REVIEWS.length) + 1];
              return (
                <article
                  key={i}
                  className="glass-card flex w-[210px] shrink-0 select-none flex-col overflow-hidden rounded-2xl md:w-[240px]"
                >
                  <div className="relative">
                    {photo ? (
                      <img
                        src={photo}
                        alt={r.org}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center gap-1 bg-ivory-deep/70 text-[11px] text-ink-soft">
                        <Camera size={13} /> 사진 준비중
                      </div>
                    )}
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-white/85 px-2.5 py-0.5 text-[10px] font-semibold text-ink shadow-sm backdrop-blur">
                      {r.org}
                    </span>
                  </div>
                  <div className="flex flex-col p-4">
                    <span className="text-[10px] font-semibold uppercase leading-none tracking-[0.1em] text-terracotta-deep">
                      {r.topic}
                    </span>
                    <div className="mt-2 flex min-h-[122px] items-center">
                      <p className="line-clamp-5 break-keep text-[13px] leading-[1.65] text-ink">
                        <span className="mr-0.5 align-[-0.1em] font-serif text-lg text-terracotta/45">
                          “
                        </span>
                        {r.quote}
                        <span className="ml-0.5 font-serif text-lg text-terracotta/45">”</span>
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            onClick={() => scroll(-1)}
            aria-label="이전 후기"
            className="glass-card absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-ink opacity-70 transition-all hover:scale-105 hover:text-terracotta-deep hover:opacity-100 md:left-4 md:opacity-0 md:group-hover/carousel:opacity-100"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="다음 후기"
            className="glass-card absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-ink opacity-70 transition-all hover:scale-105 hover:text-terracotta-deep hover:opacity-100 md:right-4 md:opacity-0 md:group-hover/carousel:opacity-100"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </SectionReveal>
    </section>
  );
}
