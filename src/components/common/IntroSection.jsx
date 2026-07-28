import React, { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { mainImage } from '../../lib/assets';
import { formatFullDate, formatTime } from '../../lib/format';
import { showsTime } from '../../lib/visibility';

const ZOOM_FROM = 1.18;
const ZOOM_TO = 1.32;
const ZOOM_SECONDS = 25;

export default function IntroSection({ view }) {
  const { groom, bride } = CONFIG.couple;

  const imgRef = useRef(null);
  const rafRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(ZOOM_FROM);

  /*
    CSS transition 은 iOS Safari 에서 첫 프레임을 건너뛰고
    최종값으로 바로 가버리는 경우가 있어 확대가 보이지 않았다.
    매 프레임 배율을 직접 계산해 넣으면 브라우저 구현에 기대지 않는다.
  */
  const start = () => {
    setLoaded(true);
    if (rafRef.current) return; // 중복 실행 방지

    const began = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - began) / (ZOOM_SECONDS * 1000));
      setScale(ZOOM_FROM + (ZOOM_TO - ZOOM_FROM) * progress);

      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    // 캐시에 있는 사진은 onLoad 가 오지 않으므로 직접 확인한다
    if (imgRef.current?.complete) start();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="relative flex aspect-[3/4] max-h-[100svh] min-h-[520px] w-full flex-col items-center justify-between overflow-hidden bg-bg text-center">
      {mainImage && (
        <img
          ref={imgRef}
          src={mainImage}
          alt="신랑 신부 대표 사진"
          onLoad={start}
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full object-cover"
          style={{
            objectPosition: CONFIG.mainPhotoPosition ?? '50% 50%',
            opacity: loaded ? 1 : 0,
            transform: `scale(${scale})`,
            transition: 'opacity 1.2s ease-out',
            willChange: 'transform',
          }}
        />
      )}

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