# Hero PhotoCollage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Hero's single static `<ProfilePhoto />` with a `<PhotoCollage />` that layers a profile photo, an auto-cycling set of up to 6 lecture photos, and a book photo, with idle float + scroll parallax motion.

**Architecture:** One new self-contained component (`PhotoCollage.tsx`) that owns three absolutely-positioned "cards" inside a relative aspect-box. Each card is two nested `motion.div`s: an outer one driven by scroll-linked `useTransform` (parallax) and an inner one driven by a looping `animate` keyframe (idle float) — nesting avoids the two animation sources fighting over the same `y` value. The lecture card additionally cycles its image via `AnimatePresence` opacity crossfade on a `setInterval`, paused on `visibilitychange`. Photos load through the same `import.meta.glob(eager)` pattern already used by `ProfilePhoto.tsx` and `Testimonials.tsx`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, `motion` (Framer Motion) — all already installed, no new dependencies.

## Global Constraints

- No new npm dependencies — use only `motion`, `react`, existing Tailwind tokens (`--color-ivory`, `--color-terracotta`, etc.).
- Animate only `transform` (translateY via `y`, fixed `rotate` via Tailwind class) and `opacity` — nothing else, for 60fps mobile.
- No `backdrop-filter`/blur on the photo cards (use `box-shadow` instead) — the existing `.glass-card` utility is NOT used here.
- App-wide `MotionConfig reducedMotion="user"` (in `src/App.tsx`) already wraps the tree — no extra reduced-motion handling needed in this component.
- Lecture photos cycle automatically only — no tap/click/swipe interaction.
- Lecture crossfade interval: ~3.8s. At most 2 lecture images mounted at once (crossfade in/out), never all 6.
- Lecture auto-cycle must stop while the tab is hidden (`document.hidden` / `visibilitychange`) and resume when visible again.
- Profile and book cards are static — never cycle, never swap images.
- Asset folders follow the existing convention (`src/assets/profile/*.{jpg,jpeg,png,webp}` eager glob): add `src/assets/lectures/` (up to 6 files, sorted by filename, numeric-aware) and `src/assets/book/` (1 file). Missing/empty folders render a dashed-border "OO 사진 준비중입니다" placeholder — never throw.
- This project has no test runner (`vitest`/`jest`) configured — verification is `npx tsc -b --noEmit`, `npm run build`, and structural/visual checks via the dev server (this mirrors how every prior change in this codebase has been verified).
- Out of scope (do not build): manual/tap advance for lecture photos, support for >6 lecture photos, multiple book photos, an image-compression build step.

---

### Task 1: PhotoCollage component + Hero wiring

**Files:**
- Create: `src/assets/lectures/.gitkeep`
- Create: `src/assets/book/.gitkeep`
- Create: `src/components/PhotoCollage.tsx`
- Modify: `src/components/Hero.tsx:3` (import), `src/components/Hero.tsx:96` (usage)
- Delete: `src/components/ProfilePhoto.tsx`

**Interfaces:**
- Consumes: nothing from other tasks (this is the only task).
- Produces: `PhotoCollage` — default export, no props, `() => JSX.Element`. Consumed by `Hero.tsx` exactly like the old `ProfilePhoto` was (`<PhotoCollage />`, no props).

- [ ] **Step 1: Create the asset folders**

```bash
mkdir -p "src/assets/lectures" "src/assets/book"
touch "src/assets/lectures/.gitkeep" "src/assets/book/.gitkeep"
```

These are where the user will later drop `1.jpg`…`6.jpg` (lectures) and a single image (book). `.gitkeep` keeps the empty folders tracked in git so they show up for the user to find.

- [ ] **Step 2: Write `src/components/PhotoCollage.tsx`**

```tsx
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
```

- [ ] **Step 3: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no output, exit code 0. If it errors on the `useRef` import ordering or unused imports, fix and re-run until clean.

- [ ] **Step 4: Wire `PhotoCollage` into `Hero.tsx`**

In `src/components/Hero.tsx`, change line 3:

```tsx
// before
import ProfilePhoto from "./ProfilePhoto";
// after
import PhotoCollage from "./PhotoCollage";
```

And change line 96 (inside the `motion.div` that used to render `<ProfilePhoto />`):

```tsx
// before
          <ProfilePhoto />
// after
          <PhotoCollage />
```

- [ ] **Step 5: Delete the now-unused `ProfilePhoto.tsx`**

```bash
rm "src/components/ProfilePhoto.tsx"
```

- [ ] **Step 6: Type-check again (confirms no dangling references)**

Run: `npx tsc -b --noEmit`
Expected: no output, exit code 0.

- [ ] **Step 7: Verify placeholder state in the browser**

Start the dev server if not already running (`npm run dev -- --port 5173`), open `http://localhost:5173/`, and in the browser devtools console (or via the Browser-pane `javascript_tool`) run:

```js
JSON.stringify({
  cards: document.querySelectorAll('[data-photo-card]').length,
  lecturePlaceholder: document.body.innerText.includes('강의 사진'),
  bookPlaceholder: document.body.innerText.includes('책 사진'),
})
```

Expected: `cards` is `3`. Since `src/assets/lectures/` and `src/assets/book/` are still empty, both `lecturePlaceholder` and `bookPlaceholder` should be `true` (dashed placeholder text visible). The profile card should show the real photo already in `src/assets/profile/` (no placeholder text for it) since that folder already has a file from earlier work.

Take a screenshot at both a desktop width (1280px) and mobile width (375px) and confirm: three overlapping/tilted cards, no layout overflow/clipping outside the Hero section, idle float visibly animating (two screenshots ~1s apart will show slightly different `y` positions).

- [ ] **Step 8: Production build**

Run: `npm run build`
Expected: build succeeds (`✓ built in ...`), no TypeScript or Tailwind errors.

- [ ] **Step 9: Commit**

```bash
git add src/components/PhotoCollage.tsx src/components/Hero.tsx src/assets/lectures/.gitkeep src/assets/book/.gitkeep
git rm src/components/ProfilePhoto.tsx
git commit -m "Hero: 프로필/강의/책 사진 레이어드 콜라주(PhotoCollage)로 교체

- 강의 사진 최대 6장 자동 크로스페이드, 프로필/책 사진은 고정
- 스크롤 패럴랙스 + 아이들 플로트 애니메이션 (transform/opacity만)
- 사진 없으면 기존 ProfilePhoto와 동일한 플레이스홀더 표시"
```

---

## Follow-up (not part of this plan)

Once the user drops real files into `src/assets/lectures/` (`1.jpg`…`6.jpg`) and `src/assets/book/`, no code changes are needed — the `import.meta.glob` picks them up automatically, same as the existing `profile` folder. Re-run Step 7's browser check to confirm the placeholders are gone and the real photos render.
