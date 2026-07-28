import React, { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { mainImage } from '../../lib/assets';
import { formatFullDate, formatTime } from '../../lib/format';
import { showsTime } from '../../lib/visibility';

/* 확대 구간과 속도 — 여기 숫자만 바꾸면 됩니다 */
const ZOOM_FROM = 1.15; // 처음 구도
const ZOOM_TO = 1.4; // 끝 구도
const ZOOM_SECONDS = 12; // 걸리는 시간

/**
 * 첫 화면 — 대표 사진 위에 이름과 날짜를 올린다.
 *
 * 확대 효과를 CSS 클래스가 아니라 인라인 스타일로 직접 준다.
 * 클래스 방식은 @keyframes 중복이나 prefers-reduced-motion 규칙에
 * 덮어써질 여지가 있어서, 어디서 막혔는지 추적하기 어려웠다.
 */
export default function IntroSection({ view }) {
  const { groom, bride } = CONFIG.couple;

  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  // 모션 최소화 설정이면 움직임 없이 고정된 구도로 보여준다
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const start = () => {
    setLoaded(true);
    // 다음 프레임에 목표값을 주어야 transition 이 실제로 재생된다
    requestAnimationFrame(() => requestAnimationFrame(() => setZoomed(true)));
  };

  /*
    캐시에 이미 있는 사진은 React 가 붙기 전에 로딩이 끝나 onLoad 가 오지 않는다.
    그러면 계속 숨겨진 채로 남으므로 마운트 시 한 번 확인한다.
  */
  useEffect(() => {
    if (imgRef.current?.complete) start();
  }, []);

  const scale = reduceMotion ? 1.2 : zoomed ? ZOOM_TO : ZOOM_FROM;

  return (
    <section className="relative flex aspect-[3/4] max-h-[100svh] min-h-[520px] w-full flex-col items-center justify-between overflow-hidden bg-bg text-center">
      {mainImage && (
        <img
          ref={imgRef}
          src={mainImage}
          alt="신랑 신부 대표 사진"
          onLoad={start}
          decoding="async"
          fetchpriority="high"
          className="absolute inset-0 z-0 h-full w-full object-cover"
          style={{
            objectPosition: CONFIG.mainPhotoPosition ?? '50% 50%',
            opacity: loaded ? 1 : 0,
            transform: `scale(${scale})`,
            transition: reduceMotion
              ? 'opacity 1.2s ease-out'
              : `opacity 1.2s ease-out, transform ${ZOOM_SECONDS}s linear`,
            willChange: 'transform',
          }}
        />
      )}

      {/* 아래쪽을 본문 배경색으로 자연스럽게 잇는 그라데이션 */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-bg" />

      <div className="relative z-20 space-y-2 pt-16 font-batang">
        <p
          className="animate-enter text-sm tracking-[0.3em] text-accent"
          style={{ animationDelay: '200ms' }}
        >
          WE ARE GETTING MARRIED
        </p>
        <h1 className="animate-enter text-3xl font-bold" style={{ animationDelay: '450ms' }}>
          {groom.name} <span className="text-accent">&amp;</span> {bride.name}
        </h1>
        <p className="animate-enter text-sm opacity-90" style={{ animationDelay: '700ms' }}>
          {formatFullDate()}
          {showsTime(view) && ` ${formatTime()}`}
        </p>
      </div>

      <div className="relative z-20 flex animate-bounce-slow flex-col items-center pb-8">
        <span className="mb-1 text-xs tracking-widest text-accent">SCROLL DOWN</span>
        <div className="flex h-8 w-5 justify-center rounded-full border-2 border-line pt-1">
          <div className="h-2 w-1 rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}