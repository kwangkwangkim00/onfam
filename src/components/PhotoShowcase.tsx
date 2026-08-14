import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// src/assets/profile, src/assets/lectures, src/assets/book 안에 사진 파일을
// 넣으면 자동으로 이 컴포넌트에 반영됩니다. lectures는 최대 6장까지
// 파일명 숫자 순서(1.jpg, 2.jpg...)로 정렬되어 사용됩니다.
const profileFiles = import.meta.glob("../assets/profile/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const lectureFiles = import.meta.glob("../assets/lectures/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const bookFiles = import.meta.glob("../assets/book/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function sortedUrls(files: Record<string, string>): string[] {
  return Object.keys(files)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((key) => files[key]);
}

const profileUrl = sortedUrls(profileFiles)[0];
const lectureUrls = sortedUrls(lectureFiles);
const bookUrl = sortedUrls(bookFiles)[0];

type Photo = { url: string; alt: string; weight: number };

// 프로필 사진은 다른 사진들보다 화면에 조금 더 오래 머뭅니다(weight 1.6배).
const PHOTOS: Photo[] = [
  ...(profileUrl ? [{ url: profileUrl, alt: "On가족코칭센터 대표강사 이덕림", weight: 1.6 }] : []),
  ...lectureUrls.map((url) => ({ url, alt: "강의 사진", weight: 1 })),
  ...(bookUrl ? [{ url: bookUrl, alt: "결혼식보다 중요한 결혼생활 준비", weight: 1 }] : []),
];

const BASE_INTERVAL_MS = 3800;

export default function PhotoShowcase() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<number | undefined>(undefined);
  const isFirstPaintRef = useRef(true);

  // 모든 사진을 미리 내려받아둬서, 전환될 때 디코딩 때문에 끊기지 않게 합니다.
  useEffect(() => {
    PHOTOS.forEach((p) => {
      const img = new window.Image();
      img.src = p.url;
    });
  }, []);

  useEffect(() => {
    isFirstPaintRef.current = false;

    if (PHOTOS.length < 2) return;

    const scheduleNext = () => {
      const duration = BASE_INTERVAL_MS * PHOTOS[index].weight;
      timeoutRef.current = window.setTimeout(() => {
        setIndex((i) => (i + 1) % PHOTOS.length);
      }, duration);
    };

    const stop = () => {
      if (timeoutRef.current !== undefined) window.clearTimeout(timeoutRef.current);
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else scheduleNext();
    };

    if (!document.hidden) scheduleNext();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [index]);

  const goToNext = () => setIndex((i) => (i + 1) % PHOTOS.length);

  const current = PHOTOS[index];

  return (
    <div className="mx-auto w-full max-w-xs sm:max-w-sm">
      <button
        type="button"
        onClick={goToNext}
        disabled={PHOTOS.length < 2}
        aria-label="다음 사진 보기"
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_20px_44px_-20px_rgba(76,47,24,0.4)]"
      >
        {current ? (
          <AnimatePresence mode="sync">
            <motion.img
              key={current.url}
              src={current.url}
              alt={current.alt}
              initial={isFirstPaintRef.current ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.9, ease: "easeInOut" },
                scale: { duration: (BASE_INTERVAL_MS / 1000) * current.weight, ease: "easeOut" },
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-ink/15 bg-ivory-deep/50 p-4 text-center text-sm text-ink-soft">
            사진 준비중입니다
          </div>
        )}
      </button>

      {PHOTOS.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {PHOTOS.map((p, i) => (
            <button
              key={p.url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}번째 사진 보기`}
              className="p-1"
            >
              <span
                className={`block h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-terracotta" : "w-1.5 bg-ink/15"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
