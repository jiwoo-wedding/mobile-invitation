import React from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { formatTime } from '../../lib/format';
import SectionTitle from '../common/SectionTitle';

/**
 * 🔒 내빈용 전용 — 예식 안내
 *
 * 문구는 invitationConfig.js 의 wedding.notes 에서 관리한다.
 * 그 값이 없으면 아래 기본 문구를 쓴다.
 */
export default function InfoSection() {
  const { venue, hall, notes } = CONFIG.wedding;

  const items = notes ?? [
    {
      title: '예식 시간',
      text: `${formatTime()}에 ${venue}${hall ? ` ${hall}` : ''}에서 진행됩니다.`,
    },
    { title: '식사 안내', text: '예식 후 같은 자리에서 식사를 준비했습니다.' },
    { title: '화환 안내', text: '마음만 감사히 받겠습니다. 화환은 정중히 사양합니다.' },
  ];

  return (
    <section className="px-5 py-6">
      <SectionTitle label="INFORMATION" sub="예식 안내" />

      <div className="space-y-3">
        {items.map((n) => (
          <div key={n.title} className="rounded-2xl border border-line/30 bg-surface/40 p-5">
            <p className="font-batang font-bold text-accent">{n.title}</p>
            <p className="mt-1 whitespace-pre-line text-sm leading-7 text-ink/90">{n.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
