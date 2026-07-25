import React from 'react';
import { Heart } from 'lucide-react';

/** 📢 외부 알림용 전용 — 소규모 예식 안내 */
export default function NoticeSection() {
  return (
    <section className="px-5 py-6 text-center">
      <div className="space-y-3 rounded-2xl border border-line/30 bg-surface/40 p-6">
        <Heart className="mx-auto text-accent" size={24} />
        <h3 className="font-batang text-lg font-bold text-accent">안내 말씀</h3>
        <p className="text-xs leading-relaxed text-muted">
          본 예식은 양가 직계가족분들만 모시고 소규모로 진행됩니다.
          <br />
          직접 모시지 못하는 죄송한 마음을 전하며,
          <br />
          마음으로 보내주시는 축하에 깊이 감사드립니다.
        </p>
      </div>
    </section>
  );
}
