import { useState } from "react";
import { Play } from "lucide-react";

// 영상 파일을 public/video/highlight.mp4 로 넣어주세요 (표지 이미지는
// public/video/highlight-poster.jpg, 선택사항). 파일이 들어오면 아래
// HAS_VIDEO를 true로 바꾸면 바로 재생 카드로 전환됩니다.
const HAS_VIDEO = false;
const VIDEO_SRC = "/video/highlight.mp4";
const POSTER_SRC = "/video/highlight-poster.jpg";

export default function HighlightReel() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="glass-card overflow-hidden rounded-3xl">
      <div className="relative aspect-video w-full bg-ink/90">
        {HAS_VIDEO ? (
          playing ? (
            <video
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              controls
              autoPlay
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="강의 현장 영상 재생"
              className="group absolute inset-0 h-full w-full"
            >
              <img
                src={POSTER_SRC}
                alt="강의 현장 영상 미리보기"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/25 transition-colors group-hover:bg-ink/35">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ivory/90 text-terracotta-deep shadow-lg transition-transform group-hover:scale-105">
                  <Play size={26} className="ml-1" fill="currentColor" />
                </span>
              </span>
            </button>
          )
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-ivory/25 text-ivory/70">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ivory/10">
              <Play size={22} className="ml-1" />
            </span>
            <p className="text-sm">강의 현장 영상 준비중입니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
