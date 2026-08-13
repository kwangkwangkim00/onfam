# Hero 사진 콜라주 (PhotoCollage) 설계

## 배경

현재 홈화면(Hero) 우측에는 `ProfilePhoto.tsx`가 프로필 사진 한 장만 보여준다. 강사가 강의 사진(6장), 프로필 사진(1장), 책 사진(1장)을 다양하게 보여주고 싶어하며, 고급스러운 느낌과 모바일 60fps 성능을 동시에 원한다. 사진 파일은 아직 없고 구조부터 만든 뒤 나중에 채워 넣을 예정이다.

## 선택한 방향: 레이어드 콜라주

브레인스토밍에서 3가지 안(레이어드 콜라주 / 오토 크로스페이드 / 벤토 그리드)을 제시했고, **레이어드 콜라주**를 선택했다.

- **프로필 사진**: 가장 크게, 메인. 살짝 기울여 배치. 정적.
- **강의 사진**: 중간 크기, 프로필 뒤쪽 위에 겹쳐 배치. 6장을 몇 초 간격으로 자동 크로스페이드. 탭/클릭 인터랙션 없음(자동 전환만).
- **책 사진**: 작게, 아래쪽에 겹쳐 배치. 1장 고정, 정적.

## 컴포넌트 구조

새 컴포넌트 `src/components/PhotoCollage.tsx` 하나로 통합하고, `Hero.tsx`에서 기존 `<ProfilePhoto />` 자리를 `<PhotoCollage />`로 교체한다. 기존 `ProfilePhoto.tsx`의 플레이스홀더-폴백 로직(사진 없을 때 "준비중" 안내)을 이 컴포넌트 안으로 흡수하고, `ProfilePhoto.tsx` 파일은 삭제한다.

### 데이터 소스 (기존 패턴 재사용)

- `src/assets/profile/*.{jpg,jpeg,png,webp}` — 기존 그대로. 1장, `import.meta.glob(eager)`로 첫 파일 사용.
- `src/assets/lectures/*.{jpg,jpeg,png,webp}` — 신규. 최대 6장, 파일명 숫자 순서(`1.jpg`~`6.jpg` 권장, `Testimonials.tsx`의 리뷰 사진 로딩과 동일한 넘버링 파싱 방식) 정렬 후 배열로 사용.
- `src/assets/book/*.{jpg,jpeg,png,webp}` — 신규. 1장, `profile`과 동일한 방식.

각 폴더가 비어 있으면 해당 카드는 점선 테두리의 "○○ 사진 준비중입니다" 플레이스홀더를 보여준다(기존 `ProfilePhoto` placeholder와 동일한 톤).

## 애니메이션 & 성능

Motion(Framer Motion) 사용, 앱 전역에 이미 적용된 `MotionConfig reducedMotion="user"`를 그대로 활용(동작 최소화 접근성 자동 대응).

1. **Idle float**: 카드 3장 각각 `animate={{ y: [0, -6, 0] }}` 형태로 서로 다른 `duration`(예: 5s/6.5s/4.5s)과 `delay`를 줘서 미세하게 위아래로 부유. `repeat: Infinity, repeatType: "mirror", ease: "easeInOut"`.
2. **스크롤 패럴랙스**: Hero에 이미 있는 `useScroll`/`useTransform` 패턴을 재사용해 카드마다 다른 배율의 `y` 변환을 적용(배경 blob들과 같은 기법).
3. **강의 사진 크로스페이드**: `useState`로 현재 인덱스 관리, `setInterval`(예: 3.5~4초)로 인덱스 증가. 렌더링은 `AnimatePresence`로 현재/다음 이미지만 opacity 크로스페이드(동시에 최대 2장만 DOM에 존재). 탭 밖으로 나가면(`document.hidden`) 타이머 정지해 배터리/성능 낭비 방지.
4. **성능 원칙**: `transform`(translateY, 고정 rotate)과 `opacity`만 애니메이션. 카드에 `backdrop-filter` 블러 미사용(box-shadow로 대체) — 사이트 전반의 `.glass-card`와 달리 이 컴포넌트는 자체 스타일 사용.

## 반응형

기존 Hero 그리드(`lg:grid-cols-[1.1fr_0.9fr]`) 구조는 그대로 두고, 콜라주 컨테이너에 기존 `ProfilePhoto`보다 살짝 넉넉한 여백을 줘서 기울어진 카드들이 잘리지 않게 한다. 모바일에서는 같은 비율로 축소, 별도 레이아웃 분기 없음.

## 구현 참고

구현 시 21st.dev Magic MCP에서 "기울어진 사진 겹침 + 크로스페이드" 유사 패턴을 참고용으로만 조회하고, 그대로 이식하지 않고 기존 디자인 토큰(`--color-ivory`, `--color-terracotta` 등, Pretendard 폰트)에 맞게 새로 작성한다.

## 범위 밖 (Out of scope)

- 탭/스와이프로 강의 사진 수동 전환 (자동 전환만)
- 강의 사진 6장 초과 시 처리 (현재는 6장 고정 가정)
- 책 사진 다장 지원 (1장 고정)
- 사진 압축/최적화 파이프라인 (사용자가 적당한 크기로 넣는다고 가정, 별도 이미지 최적화 빌드 단계는 만들지 않음)
