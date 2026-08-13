import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

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

const LECTURE_INTERVAL_MS = 3800;

const cardShadow = "shadow-[0_20px_44px_-20px_rgba(76,47,24,0.4)]";
const placeholderClass =
  "flex h-full w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-ink/15 bg-ivory-deep/50 p-2 text-center text-[11px] leading-snug text-ink-soft";

type CardFrameProps = {
  className: string;
  floatDuration: number;
  floatDelay: number;
  parallaxRange: [number, number];
  scrollYProgress: MotionValue<number>;
  children: ReactNode;
};

function CardFrame({
  className,
  floatDuration,
  floatDelay,
  parallaxRange,
  scrollYProgress,
  children,
}: CardFrameProps) {
  const y = useTransform(scrollYProgress, [0, 1], parallaxRange);

  return (
    <motion.div
      data-photo-card
      style={{ y }}
      className={`absolute overflow-hidden rounded-3xl ${cardShadow} ${className}`}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: floatDuration,
          delay: floatDelay,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        className="relative h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function StaticPhotoCard({
  imageUrl,
  alt,
  placeholderLabel,
  ...frameProps
}: Omit<CardFrameProps, "children"> & {
  imageUrl?: string;
  alt: string;
  placeholderLabel: string;
}) {
  return (
    <CardFrame {...frameProps}>
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className={placeholderClass}>
          {placeholderLabel}
          <br />
          준비중입니다
        </div>
      )}
    </CardFrame>
  );
}

function LectureCard(frameProps: Omit<CardFrameProps, "children">) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (lectureUrls.length < 2) return;

    let id: number | undefined;

    const start = () => {
      id = window.setInterval(() => {
        setIndex((i) => (i + 1) % lectureUrls.length);
      }, LECTURE_INTERVAL_MS);
    };
    const stop = () => {
      if (id !== undefined) window.clearInterval(id);
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const currentUrl = lectureUrls[index];

  return (
    <CardFrame {...frameProps}>
      {currentUrl ? (
        <AnimatePresence mode="sync">
          <motion.img
            key={currentUrl}
            src={currentUrl}
            alt="강의 사진"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      ) : (
        <div className={placeholderClass}>
          강의 사진
          <br />
          준비중입니다
        </div>
      )}
    </CardFrame>
  );
}

export default function PhotoCollage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <div ref={ref} className="relative mx-auto aspect-[4/5] w-full max-w-xs sm:max-w-sm">
      <StaticPhotoCard
        imageUrl={profileUrl}
        alt="On가족코칭센터 대표강사 이덕림"
        placeholderLabel="프로필 사진"
        className="left-[8%] top-[10%] z-10 h-[68%] w-[70%] -rotate-2"
        floatDuration={5.5}
        floatDelay={0}
        parallaxRange={[0, -12]}
        scrollYProgress={scrollYProgress}
      />
      <LectureCard
        className="right-0 top-0 z-20 h-[42%] w-[46%] rotate-3"
        floatDuration={4.5}
        floatDelay={0.4}
        parallaxRange={[0, 16]}
        scrollYProgress={scrollYProgress}
      />
      <StaticPhotoCard
        imageUrl={bookUrl}
        alt="결혼식보다 중요한 결혼생활 준비"
        placeholderLabel="책 사진"
        className="bottom-0 left-0 z-30 h-[34%] w-[38%] -rotate-6"
        floatDuration={6.5}
        floatDelay={0.8}
        parallaxRange={[0, -8]}
        scrollYProgress={scrollYProgress}
      />
    </div>
  );
}
