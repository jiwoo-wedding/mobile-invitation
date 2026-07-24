import React from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { withDeceased } from '../../lib/format';

/** 인사말 — 초대장 종류(view)에 따라 문구가 통째로 바뀐다 */
export default function GreetingSection({ view }) {
  const { groom, bride } = CONFIG.couple;

  const parentLine = (side, child) => (
    <p>
      <span className="font-semibold">
        {withDeceased(side.father, side.fatherDeceased)} ·{' '}
        {withDeceased(side.mother, side.motherDeceased)}
      </span>{' '}
      의 {side.order} <span className="font-bold text-accent">{child}</span>
    </p>
  );

  return (
    <section className="px-6 py-8 text-center font-batang">
      <div className="space-y-6 rounded-2xl border border-line/30 bg-surface/40 p-8 backdrop-blur-sm">
        <div className="text-xs tracking-[0.3em] text-accent">{view.greetingTitle}</div>

        <div className="space-y-1 text-sm text-ink/90">
          {parentLine(groom, groom.name)}
          {parentLine(bride, bride.name)}
        </div>

        <div className="py-2 text-accent" aria-hidden="true">
          ★
        </div>

        <p className="whitespace-pre-line text-sm leading-8 text-ink/90">{view.greetingText}</p>
      </div>
    </section>
  );
}
