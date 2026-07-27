import React from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { withDeceased } from '../../lib/format';

/** 인사말 — 초대장 종류(view)에 따라 문구가 통째로 바뀐다 */
export default function GreetingSection({ view }) {
  const { groom, bride } = CONFIG.couple;

  /*
    부모님 · 관계 · 이름을 3개의 열로 나눈다.

    한 줄로 이어 쓰면 '첫째 아들'(4자)과 '둘째 딸'(3자)의 길이 차이만큼
    두 이름이 서로 어긋난다.
    열을 나누면 가장 긴 내용에 맞춰 폭이 정해지므로 이름이 같은 선에서 시작한다.

      장재필 · 최미순 │ 의 첫째 아들 │ 장성빈
      엄길용 · 조영순 │ 의 둘째 딸   │ 엄지우

    관계는 한 덩어리로 둔다. '첫째'와 '아들'을 따로 정렬하면
    '둘째    딸' 처럼 문장 중간이 벌어져 더 어색해진다.
  */
  const rows = [
    { side: groom, name: groom.name },
    { side: bride, name: bride.name },
  ];

  return (
    <section className="px-5 py-8 text-center font-batang">
      <div className="space-y-6 rounded-2xl border border-line/30 bg-surface/40 p-8 backdrop-blur-sm">
        <div className="text-xs tracking-[0.3em] text-accent">{view.greetingTitle}</div>

        <div className="mx-auto grid w-fit grid-cols-[auto_auto_auto] items-baseline gap-x-2 gap-y-1.5 text-sm">
          {rows.map(({ side, name }) => (
            <React.Fragment key={name}>
              <span className="whitespace-nowrap text-right font-semibold text-ink/90">
                {withDeceased(side.father, side.fatherDeceased)} ·{' '}
                {withDeceased(side.mother, side.motherDeceased)}
              </span>
              <span className="whitespace-nowrap text-left text-muted">의 {side.order}</span>
              <span className="whitespace-nowrap text-left font-bold text-accent">{name}</span>
            </React.Fragment>
          ))}
        </div>

        <div className="py-2 text-accent" aria-hidden="true">
          -
        </div>

        <p className="whitespace-pre-line text-sm leading-8 text-ink/90">{view.greetingText}</p>
      </div>
    </section>
  );
}