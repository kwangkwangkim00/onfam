// src/assets/profile/ 안에 사진 파일 하나를 넣으면(이름 무관) 자동으로 이 자리에 표시됩니다.
const photoFiles = import.meta.glob("../assets/profile/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const photoUrl = Object.values(photoFiles)[0];

export default function ProfilePhoto() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-3xl shadow-[0_24px_60px_-24px_rgba(76,47,24,0.35)]">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="On가족코칭센터 대표강사 이덕림"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-ink/15 bg-ivory-deep/50 text-center text-sm text-ink-soft">
          강사 프로필 사진
          <br />
          준비중입니다
        </div>
      )}
    </div>
  );
}
