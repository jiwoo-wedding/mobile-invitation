import React, { useState } from 'react';
import { Phone, MessageSquare, X } from 'lucide-react';
import { CONFIG } from '../../config/invitationConfig';
import { withDeceased } from '../../lib/format';

/** 연락처 목록을 만든다. 고인으로 표시된 분은 목록에서 제외한다. */
function buildContacts() {
  const { groom, bride } = CONFIG.couple;

  const side = (person, sideLabel, childLabel) =>
    [
      { group: sideLabel, role: childLabel, name: person.name, tel: person.tel },
      !person.fatherDeceased && {
        group: sideLabel,
        role: '아버지',
        name: withDeceased(person.father, false),
        tel: person.fatherTel,
      },
      !person.motherDeceased && {
        group: sideLabel,
        role: '어머니',
        name: person.mother,
        tel: person.motherTel,
      },
    ].filter(Boolean);

  return [...side(groom, '신랑측', '신랑'), ...side(bride, '신부측', '신부')].filter((c) => c.tel);
}

export default function ContactSection() {
  const [open, setOpen] = useState(false);
  const contacts = buildContacts();

  return (
    <section className="px-6 py-4 text-center">
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 font-bold text-accent-fg shadow"
      >
        <Phone size={18} /> 연락하기
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-label="연락처"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-mobile space-y-3 rounded-t-3xl border-t border-line/30 bg-bg p-6 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-batang text-lg font-bold text-accent">연락처</h3>
              <button onClick={() => setOpen(false)} aria-label="닫기" className="text-muted">
                <X size={20} />
              </button>
            </div>

            <ul className="space-y-2 text-left">
              {contacts.map((c) => (
                <li
                  key={`${c.group}-${c.role}`}
                  className="flex items-center justify-between rounded-lg bg-surface/50 p-3"
                >
                  <div className="text-sm">
                    <p className="text-xs text-muted">
                      {c.group} {c.role}
                    </p>
                    <p className="font-bold">{c.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${c.tel}`}
                      aria-label={`${c.name}에게 전화하기`}
                      className="rounded-lg bg-accent p-2 text-accent-fg"
                    >
                      <Phone size={16} />
                    </a>
                    <a
                      href={`sms:${c.tel}`}
                      aria-label={`${c.name}에게 문자 보내기`}
                      className="rounded-lg border border-line/40 p-2 text-accent"
                    >
                      <MessageSquare size={16} />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
