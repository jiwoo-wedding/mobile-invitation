import React from 'react';
import { CONFIG } from '../../config/invitationConfig';
import SectionTitle from '../common/SectionTitle';

/** 🔒 내빈용 전용 — 예식장 상세 안내 */
export default function InfoSection() {
  const notes = [
    { title: '예식 시간', text: `${CONFIG.wedding.venue} ${CONFIG.wedding.hall}에서 진행됩니다.` },
    { title: '식사 안내', text: '예식 후 같은 층 연회장에서 식사를 준비했습니다.' },
    { title: '화환 안내', text: '마음만 감사히 받겠습니다. 화환은 정중히 사양합니다.' },
  ];

  return (
    <section className="px-5 py-6">
      <SectionTitle label="INFORMATION" sub="예식 안내" />

      <div className="space-y-3">
        {notes.map((n) => (
          <div key={n.title} className="rounded-2xl border border-line/30 bg-surface/40 p-5">
            <p className="font-batang font-bold text-accent">{n.title}</p>
            <p className="mt-1 text-sm leading-7 text-ink/90">{n.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
