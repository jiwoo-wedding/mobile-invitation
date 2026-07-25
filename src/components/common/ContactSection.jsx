import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { CONFIG } from '../../config/invitationConfig';
import SectionTitle from './SectionTitle';

/**
 * 연락처 — 신랑측 / 신부측을 좌우 두 칸으로 나눈다.
 *
 * 두 칸을 구분하는 방법으로 색을 새로 만들지 않고,
 * 같은 악센트 색의 "채움 / 테두리" 짝으로 대비를 준다.
 * 이렇게 하면 13개 테마 어디서든 의도한 대비가 그대로 유지된다.
 */
export default function ContactSection() {
  const { groom, bride } = CONFIG.couple;

  /** 고인으로 표시된 분과 번호가 없는 분은 목록에서 제외한다 */
  const people = (person, selfRole) =>
    [
      { role: selfRole, name: person.name, tel: person.tel },
      !person.fatherDeceased && { role: '아버지', name: person.father, tel: person.fatherTel },
      !person.motherDeceased && { role: '어머니', name: person.mother, tel: person.motherTel },
    ].filter((p) => p && p.tel);

  const sides = [
    {
      key: 'groom',
      label: '신랑측',
      // 채운 쪽
      card: 'border-accent/45 bg-accent/10',
      badge: 'bg-accent text-accent-fg',
      list: people(groom, '신랑'),
    },
    {
      key: 'bride',
      label: '신부측',
      // 비운 쪽
      card: 'border-line/25 bg-surface/60',
      badge: 'border border-accent/60 text-accent',
      list: people(bride, '신부'),
    },
  ];

  return (
    <section className="px-5 py-6">
      <SectionTitle label="CONTACT" sub="연락처" />

      <div className="grid grid-cols-2 gap-3">
        {sides.map((side) => (
          <div key={side.key} className={`rounded-2xl border p-3 ${side.card}`}>
            <p
              className={`mb-3 rounded-lg py-2 text-center text-[11px] font-bold tracking-[0.2em] ${side.badge}`}
            >
              {side.label}
            </p>

            <ul className="space-y-2">
              {side.list.map((person) => (
                <li
                  key={`${side.key}-${person.role}`}
                  className="rounded-xl bg-bg/50 px-2 py-2.5 text-center"
                >
                  <p className="text-[10px] tracking-wide text-muted">{person.role}</p>
                  <p className="mt-0.5 font-batang text-sm font-bold leading-tight">
                    {person.name}
                  </p>

                  <div className="mt-2 flex gap-1.5">
                    <a
                      href={`tel:${person.tel}`}
                      aria-label={`${person.name}에게 전화하기`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-md bg-accent py-1.5 text-[10px] font-bold text-accent-fg transition-transform active:scale-95"
                    >
                      <Phone size={11} /> 전화
                    </a>
                    <a
                      href={`sms:${person.tel}`}
                      aria-label={`${person.name}에게 문자 보내기`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-md border border-accent/50 py-1.5 text-[10px] font-bold text-accent transition-transform active:scale-95"
                    >
                      <MessageSquare size={11} /> 문자
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
