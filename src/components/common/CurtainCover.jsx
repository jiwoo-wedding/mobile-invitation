import React from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { formatFullDate, formatTime } from '../../lib/format';
import { asset } from '../../lib/assets';

/** 초대장 열기 화면 (CONFIG.useCurtain 이 true 일 때만 표시) */
export default function CurtainCover({ onOpen }) {
  const { groom, bride } = CONFIG.couple;

  return (
    <div className="mobile-container flex flex-col items-center justify-center text-center px-8 text-ink">
      <img
        src={asset('images/hero/1.jpg')}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="relative z-10 animate-fade-up space-y-6">
        <p className="font-batang text-xs tracking-[0.4em] text-accent">WEDDING INVITATION</p>
        <h1 className="font-batang text-3xl font-bold">
          {groom.name} <span className="text-accent">·</span> {bride.name}
        </h1>
        <p className="text-sm text-muted">
          {formatFullDate()}
          <br />
          {formatTime()} · {CONFIG.wedding.venue}
        </p>
        <button
          onClick={onOpen}
          className="mt-4 rounded-full border border-line bg-accent px-8 py-3 text-sm font-bold text-accent-fg shadow"
        >
          초대장 열기
        </button>
      </div>
    </div>
  );
}
