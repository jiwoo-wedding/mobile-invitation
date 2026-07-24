import React, { useState } from 'react';
import { Copy, Check, Link2 } from 'lucide-react';
import { CONFIG } from '../../config/invitationConfig';
import { formatFullDate } from '../../lib/format';

/**
 * 푸터 — 공유용 링크를 종류별로 분리해서 복사한다.
 *  - 외부 알림용 : 파라미터 없는 기본 주소
 *  - 내빈용     : ?type=guest 가 붙은 주소 (내빈용 페이지에서만 노출)
 */
export default function Footer({ type }) {
  const [copied, setCopied] = useState('');

  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const links = {
    announcement: baseUrl,
    guest: `${baseUrl}?type=guest`,
  };

  const copy = (key) => {
    navigator.clipboard.writeText(links[key]);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const { groom, bride } = CONFIG.couple;

  return (
    <footer className="space-y-4 bg-surface/50 px-6 py-10 text-center">
      <p className="font-batang text-sm text-accent">
        {groom.name} &amp; {bride.name}
      </p>
      <p className="text-xs text-muted">{formatFullDate()}</p>

      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => copy('announcement')}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-accent-fg shadow"
        >
          {copied === 'announcement' ? <Check size={16} /> : <Copy size={16} />}
          {copied === 'announcement' ? '복사했습니다' : '알림용 링크 복사'}
        </button>

        {type === 'guest' && (
          <button
            onClick={() => copy('guest')}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line/40 py-3 text-sm font-bold text-accent"
          >
            {copied === 'guest' ? <Check size={16} /> : <Link2 size={16} />}
            {copied === 'guest' ? '복사했습니다' : '내빈용 링크 복사'}
          </button>
        )}
      </div>

      {type === 'guest' && (
        <p className="pt-1 text-[11px] leading-5 text-muted">
          내빈용 링크에는 장소 · 계좌 · 참석 여부가 포함됩니다.
          <br />
          직계가족과 친지분들께만 전달해 주세요.
        </p>
      )}
    </footer>
  );
}
