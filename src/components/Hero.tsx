import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import PhotoShowcase from "./PhotoShowcase";

const CREDENTIALS = [
  "서울가족학교 예비부부교실 위촉강사",
  "시립보라매청소년센터 위촉강사",
  "EBS 지도강사",
  "결혼식보다 중요한 결혼생활 준비 저서",
  "KAC(Korea Associate Coach) 인증코치",
  "가족 코칭 지도사",
  "예비부부 코칭지도사",
  "부모교육지도자 1급",
  "상담심리사 1급",
  "DISC 1급, MBTI, 에니어그램 강사 자격",
  "BIGGER GAME 트레이너",
  "소명지도사 2급",
  "환경교육사 3급",
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pb-12 pt-24 md:pb-16 md:pt-28">
      <motion.div
        style={{ y: y1 }}
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-clay/40 blur-3xl md:h-96 md:w-96"
      />
      <motion.div
        style={{ y: y2 }}
        className="pointer-events-none absolute -left-20 top-64 h-64 w-64 rounded-full bg-terracotta/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-balance break-keep text-3xl font-bold leading-[1.3] tracking-tight md:text-4xl lg:text-[2.15rem]"
          >
            <span className="text-ink">건강한 </span>
            <span className="text-terracotta">부부,</span>
            <span className="text-ink"> 건강한 </span>
            <span className="text-terracotta">가족</span>
            <br />
            <span className="text-ink">건강한 </span>
            <span className="text-terracotta">조직</span>
            <span className="text-ink">을 세우는</span>
            <br className="md:hidden" />
            <span className="text-terracotta"> 이덕림</span>
            <span className="text-ink"> 입니다.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl break-keep text-[13px] leading-relaxed text-ink-soft md:mx-0 md:text-lg"
          >
            기업과 공공기관의 임직원을 위한 부부·가족 소통 교육입니다.
            <br />
            코칭 이론과 현장형 워크숍으로 삶에 남는 변화를 만듭니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <a
              href="#contact"
              className="w-full rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-ivory shadow-[0_16px_32px_-14px_rgba(196,116,76,0.6)] transition-transform hover:scale-[1.03] hover:bg-terracotta-deep sm:w-auto"
            >
              강의 문의하기
            </a>
            <a
              href="#record"
              className="w-full rounded-full border border-ink/15 bg-ivory/60 px-7 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:border-terracotta/40 hover:text-terracotta-deep sm:w-auto"
            >
              출강 이력 보기
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <PhotoShowcase />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="relative mx-auto mt-16 max-w-7xl px-6"
      >
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-ink/10 pt-8">
          {CREDENTIALS.map((c) => (
            <span
              key={c}
              className="rounded-full bg-ivory/70 px-3.5 py-1.5 text-xs font-medium text-ink-soft backdrop-blur"
            >
              {c}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
