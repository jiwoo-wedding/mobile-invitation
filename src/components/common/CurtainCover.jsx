import React from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { formatFullDate, formatTime, formatShortDate } from '../../lib/format';
import { showsTime, showsVenue } from '../../lib/visibility';

/**
 * 첫 화면 (CONFIG.useCurtain 이 true 일 때만 표시)
 *
 * 480px 컨테이너에 갇히지 않고 화면 전체를 채운다.
 * 사진 없이, 청첩장 카드처럼 이중 테두리와 글자만으로 구성했다.
 *
 * 링크 종류에 따라 성격이 다르므로 문구와 노출 정보를 나눈다.
 *   내빈용 : 초대하는 자리 → 'INVITATION' / '초대장 열기' / 날짜 + 시간 + 예식장
 *   외부용 : 알리는 소식   → 'WEDDING ANNOUNCEMENT' / '소식 보기' / 날짜만
 *
 * 외부 손님은 초대하지 않으므로, 외부용에서는 시간과 예식장을 표시하지 않는다.
 * (오시라는 뜻으로 읽힐 정보를 남기지 않는다)
 * (문구를 바꾸고 싶으면 invitationConfig.js 의 각 종류에
 *  curtainLabel / curtainButton 을 추가하면 그 값이 우선한다)
 */
const CURTAIN_TEXT = {
  guest: { label: 'INVITATION', button: '초대장 열기' },
  announcement: { label: 'WEDDING ANNOUNCEMENT', button: '소식 보기' },
};

export default function CurtainCover({ onOpen, view }) {
  const { groom, bride } = CONFIG.couple;
  const { venue, hall } = CONFIG.wedding;

  const preset = CURTAIN_TEXT[view?.type] ?? CURTAIN_TEXT.announcement;
  const label = view?.curtainLabel ?? preset.label;
  const buttonText = view?.curtainButton ?? preset.button;

  return (
    <div className="cover-screen fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-bg px-6 text-ink">
      {/* 청첩장 카드 느낌의 이중 테두리 */}
      <div className="cover-frame pointer-events-none absolute inset-4 border border-line/25 sm:inset-8" />
      <div
        className="cover-frame pointer-events-none absolute inset-[22px] border border-line/12 sm:inset-[38px]"
        style={{ animationDelay: '140ms' }}
      />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-12 text-center">
        <p className="animate-enter font-batang text-[10px] tracking-[0.55em] text-accent">
          {label}
        </p>

        <div className="animate-enter space-y-5" style={{ animationDelay: '250ms' }}>
          <h1 className="font-batang text-[2.6rem] font-bold leading-none">{groom.name}</h1>

          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-line/40" aria-hidden="true" />
            <span className="font-batang text-xs text-accent">그리고</span>
            <span className="h-px w-8 bg-line/40" aria-hidden="true" />
          </div>

          <h1 className="font-batang text-[2.6rem] font-bold leading-none">{bride.name}</h1>
        </div>

        <div className="animate-enter space-y-2" style={{ animationDelay: '450ms' }}>
          <p className="font-batang text-base tracking-[0.2em] text-accent tabular-nums">
            {formatShortDate()}
          </p>
          <p className="text-xs leading-6 text-muted">
            {formatFullDate()}
            {showsTime(view) && ` ${formatTime()}`}
            {showsVenue(view) && (
              <>
                <br />
                {venue} {hall}
              </>
            )}
          </p>
        </div>

        <button
          onClick={onOpen}
          className="animate-enter rounded-full border border-line bg-accent px-9 py-3.5 text-sm font-bold tracking-wide text-accent-fg shadow-lg transition-transform active:scale-95"
          style={{ animationDelay: '650ms' }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
