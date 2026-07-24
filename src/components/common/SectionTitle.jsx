import React from 'react';

/** 섹션 공통 제목 (영문 라벨 + 한글 부제) */
export default function SectionTitle({ label, sub }) {
  return (
    <header className="text-center mb-6">
      <h2 className="font-batang text-xl font-bold tracking-widest text-accent">{label}</h2>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </header>
  );
}
