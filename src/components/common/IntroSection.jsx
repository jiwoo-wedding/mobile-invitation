import React, { useState } from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { mainImage } from '../../lib/assets';
import { formatFullDate, formatTime } from '../../lib/format';
import { showsTime } from '../../lib/visibility';

/**
 * 첫 화면 — 대표 사진 위에 이름과 날짜를 올린다.
 * 외부 알림용에서는 예식 시간을 빼고 날짜만 보여준다.
 */
export default function IntroSection({ view }) {
  const { groom, bride } = CONFIG.couple;

  /*
    사진을 다 받기 전에 보여주면, 베이스라인 JPEG 특성상
    위쪽부터 한 줄씩 그려져서 아래는 빈칸으로 남는다.
    다 받은 뒤에 나타나게 해서 중간 상태를 감춘다.
  */
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="relative flex aspect-[3/4] max-h-[100svh] min-h-[520px] w-full flex-col items-center justify-between overflow-hidden bg-bg text-center">
      {mainImage && (
        <img
          src={mainImage}
          alt="신랑 신부 대표 사진"
          onLoad={() => setLoaded(true)}
          decoding="async"
          fetchPriority="high"
          className={`absolute inset-0 z-0 h-full w-full object-cover ${
            loaded ? 'animate-ken-burns' : 'opacity-0'
          }`}
          style={{ objectPosition: CONFIG.mainPhotoPosition ?? '50% 50%' }}
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