import { Heart, HeartHandshake, MessagesSquare, Globe, Compass, Building2 } from "lucide-react";
import SectionReveal from "./SectionReveal";

// href를 넣으면 카드를 클릭했을 때 해당 후기 블로그 글로 연결됩니다.
const TOPICS: {
  icon: typeof Heart;
  title: string;
  desc: string;
  href?: string;
}[] = [
  {
    icon: Heart,
    title: "예비부부·신혼부부교육",
    desc: "결혼 전후 가장 많이 부딪히는 성격 차이·재무관리·원가족 문제를 미리 점검합니다. 결혼준비 단계에서 놓치기 쉬운 대화를 미리 나눠볼 수 있어요.",
    href: "https://blog.naver.com/duckkonni/223921055251",
  },
  {
    icon: HeartHandshake,
    title: "중년부부교육",
    desc: "결혼 10년 이상 지난 부부를 위한 관계 재점검 프로그램입니다. 익숙해진 사이에서 놓치기 쉬운 대화와 정서적 거리감을 되짚어봅니다.",
    href: "https://blog.naver.com/duckkonni/223977197422",
  },
  {
    icon: MessagesSquare,
    title: "부부소통·재무교육",
    desc: "이미 함께 살고 있는 부부를 위한 대화법과 생활비·자산관리 이야기입니다. 반복되는 갈등의 패턴을 찾아 대화 방식을 바꿉니다.",
    href: "https://blog.naver.com/duckkonni/224361498080",
  },
  {
    icon: Globe,
    title: "다문화가정교육",
    desc: "언어와 문화가 다른 부부·가족이 서로를 더 깊이 이해하도록 돕습니다. 감정 표현과 양육 방식의 차이를 좁혀갑니다.",
    href: "https://blog.naver.com/duckkonni/224091209944",
  },
  {
    icon: Compass,
    title: "청소년 리더십·진로특강",
    desc: "성격유형 검사와 진로 탐색을 결합해 학생들이 자신의 강점을 찾도록 돕습니다. 학생회·동아리 리더십 캠프에 특히 잘 맞습니다.",
    href: "https://blog.naver.com/duckkonni/223901231789",
  },
  {
    icon: Building2,
    title: "기업 임직원 가족교육",
    desc: "일과 가정의 균형이 흔들리는 임직원을 위한 부부·가족 소통 프로그램입니다. 가족친화 경영을 위한 복지 프로그램으로도 활용됩니다.",
    href: "https://blog.naver.com/duckkonni/224055927374",
  },
];

export default function Philosophy() {
  return (
    <section id="philosophy" className="bg-ivory-deep/60 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionReveal className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-deep">
            강의 분야
          </p>
          <h2 className="mt-3 break-keep text-3xl font-bold text-ink md:text-4xl md:text-balance">
            삶의 단계마다 필요한
            <br className="md:hidden" /> 교육이 있습니다
          </h2>
          <p className="mt-2 text-xs text-ink-soft/70">각 강의별 블로그 후기를 볼 수 있어요</p>
        </SectionReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((topic, i) => {
            const Card = topic.href ? "a" : "div";
            return (
              <SectionReveal key={topic.title} delay={i * 0.06}>
                <Card
                  {...(topic.href
                    ? { href: topic.href, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`glass-card group flex h-full flex-col rounded-3xl p-6 ${
                    topic.href ? "transition-transform hover:-translate-y-1" : ""
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-terracotta/12 text-terracotta-deep">
                    <topic.icon size={20} strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink break-keep">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft break-keep">
                    {topic.desc}
                  </p>
                  {topic.href && (
                    <span className="mt-4 text-sm font-semibold text-terracotta-deep transition-colors group-hover:text-terracotta">
                      후기 보러가기 →
                    </span>
                  )}
                </Card>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
