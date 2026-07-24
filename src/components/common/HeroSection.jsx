import React from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { asset } from '../../lib/assets';
import { formatFullDate, formatTime } from '../../lib/format';

export default function HeroSection() {
  const { groom, bride } = CONFIG.couple;

  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-between overflow-hidden text-center">
      <img
        src={asset('images/hero/1.jpg')}
        alt="신랑 신부 메인 사진"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      {/* 아래쪽을 본문 배경색으로 자연스럽게 잇는 그라데이션 */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-bg" />

      <div className="relative z-20 space-y-2 pt-16 font-batang">
        <p className="text-sm tracking-[0.3em] text-accent">WE ARE GETTING MARRIED</p>
        <h1 className="text-3xl font-bold">
          {groom.name} <span className="text-accent">&amp;</span> {bride.name}
        </h1>
        <p className="text-sm opacity-90">
          {formatFullDate()} {formatTime()}
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
