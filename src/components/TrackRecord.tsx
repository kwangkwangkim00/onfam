import SectionReveal from "./SectionReveal";
import lgLogo from "../assets/logos/lg-symbol.svg";
import hyundaiLogo from "../assets/logos/hyundai-elevator.svg";
import hfLogo from "../assets/logos/hf-official.png";
import dsuLogo from "../assets/logos/dongseoul-official.png";
import gangwonLogo from "../assets/logos/gangwon-training-institute.png";
import smycLogo from "../assets/logos/seoul-youth-center.png";
import guroLogo from "../assets/logos/guro-youth-room.jpg";
import ebsLogo from "../assets/logos/ebs.svg";
import emartLogo from "../assets/logos/emart.svg";
import dongjakLogo from "../assets/logos/dongjak.png";
import seoulEduLogo from "../assets/logos/seoul-edu.svg";
import chungnamEduLogo from "../assets/logos/chungnam-edu.svg";
import arteLogo from "../assets/logos/arte.svg";
import guidanceLogo from "../assets/logos/guidance.svg";
import suwonLogo from "../assets/logos/suwon-family.png";
import darimakerLogo from "../assets/logos/darimaker.png";
import familynetLogo from "../assets/logos/familynet-header.png";
import shLogo from "../assets/logos/sh-corp.svg";
import familyseoulLogo from "../assets/logos/familyseoul-icon.png";
import boramaeLogo from "../assets/logos/boramae.jpg";
import dongjakCultureLogo from "../assets/logos/dongjak-culture.png";
import donghaengLogo from "../assets/logos/donghaeng.svg";
import dongshinLogo from "../assets/logos/dongshin-church.png";
import nadulmokLogo from "../assets/logos/nadulmok-church.png";

// 인지도·관계 규모 순으로 배치. 로고 파일을 구한 기관은 실제 로고를,
// 아직 못 구한 기관은 이니셜 모노그램으로 표시합니다(logoUrl 추가 시 바로 교체 가능).
// 서울북부교육청은 자체 로고를 못 찾아 상위기관인 서울특별시교육청 로고로 대신합니다.
// 가족센터는 여러 자치구 중 주요 지역만 남겨 24곳으로 정리했습니다.
type Institution = {
  org: string;
  logo?: string;
  mark?: string;
  invert?: boolean;
  compact?: boolean;
};

const RECORDS: Institution[] = [
  { org: "LG전자", logo: lgLogo },
  { org: "서울가족학교", logo: familyseoulLogo },
  { org: "EBS", logo: ebsLogo },
  { org: "현대엘리베이터", logo: hyundaiLogo },
  { org: "한국주택금융공사", logo: hfLogo },
  { org: "서울주택도시공사", logo: shLogo },
  { org: "이마트 컬쳐클럽", logo: emartLogo },
  { org: "각 자치구 가족센터", logo: familynetLogo },
  { org: "동서울대학교", logo: dsuLogo },
  { org: "시립보라매청소년센터", logo: boramaeLogo },
  { org: "서울광역청년센터", logo: smycLogo },
  { org: "강원특별자치도 공무원교육원", logo: gangwonLogo, invert: true, compact: true },
  { org: "한국문화예술교육진흥원", logo: arteLogo },
  { org: "동작구청", logo: dongjakLogo },
  { org: "동작문화재단", logo: dongjakCultureLogo },
  { org: "서울북부교육청", logo: seoulEduLogo },
  { org: "충청남도교육청", logo: chungnamEduLogo },
  { org: "구로청년이룸", logo: guroLogo },
  { org: "수원시건강가정지원센터", logo: suwonLogo },
  { org: "나들목하늘교회", logo: nadulmokLogo },
  { org: "다리메이커", logo: darimakerLogo },
  { org: "동신교회", logo: dongshinLogo },
  { org: "한국가이던스", logo: guidanceLogo },
  { org: "동행클럽", logo: donghaengLogo },
];

export default function TrackRecord() {
  return (
    <section id="record" className="bg-ivory-deep/60 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionReveal className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-deep">
            출강 이력
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-ink md:text-4xl">
            함께한 기관
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty break-keep text-sm font-semibold text-ink md:text-base">
            수많은 기업과 공공기관이 먼저 찾아주는,
            <br className="md:hidden" /> 이유 있는 소통·리더십의 해답
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-pretty break-keep text-sm text-ink-soft">
            소통과 성장으로 고민하는 전국 수많은 기업·기관과
            <br className="md:hidden" /> 늘 함께 호흡하고 있습니다.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {RECORDS.map((item, i) => (
            <SectionReveal key={item.org} delay={(i % 6) * 0.05}>
              <div className="glass-card group flex h-full flex-col items-center gap-2.5 rounded-2xl px-4 py-5 text-center transition-transform hover:-translate-y-1">
                <div className="flex h-14 w-full items-center justify-center rounded-xl bg-white/90 p-2 shadow-[0_2px_10px_-4px_rgba(76,47,24,0.25)]">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={item.org}
                      className={`max-h-8 max-w-full object-contain ${item.invert ? "invert" : ""}`}
                    />
                  ) : (
                    <span className="text-sm font-bold tracking-tight text-terracotta-deep">
                      {item.mark}
                    </span>
                  )}
                </div>
                <p
                  className={`font-bold leading-snug text-ink ${
                    item.compact ? "whitespace-nowrap text-[10px]" : "text-xs"
                  }`}
                >
                  {item.org}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
