import React, { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';
import { CONFIG } from '../../config/invitationConfig';
import SectionTitle from '../common/SectionTitle';

/** 🔒 내빈용 전용 — 마음 전하실 곳 (아코디언) */
export default function AccountSection() {
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState('');

  const copy = (number, key) => {
    navigator.clipboard.writeText(number.replaceAll('-', ''));
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const groups = [
    { key: 'groom', label: '신랑측 계좌번호', list: CONFIG.accounts.groom },
    { key: 'bride', label: '신부측 계좌번호', list: CONFIG.accounts.bride },
  ];

  return (
    <section className="space-y-4 px-6 py-6">
      <SectionTitle label="ACCOUNT" sub="마음 전하실 곳" />

      <p className="text-center text-xs leading-6 text-muted">
        참석이 어려우신 분들을 위해 계좌를 안내드립니다.
        <br />
        보내주신 정성은 소중히 간직하겠습니다.
      </p>

      {groups.map((group) => (
        <div
          key={group.key}
          className="overflow-hidden rounded-xl border border-line/30 bg-surface/40"
        >
          <button
            onClick={() => setOpen(open === group.key ? null : group.key)}
            aria-expanded={open === group.key}
            className="flex w-full items-center justify-between p-4 font-bold"
          >
            <span>{group.label}</span>
            <ChevronDown
              size={20}
              className={`transition-transform ${open === group.key ? 'rotate-180' : ''}`}
            />
          </button>

          {open === group.key && (
            <div className="space-y-3 border-t border-line/20 p-4 text-sm">
              {group.list.map((acc) => {
                const key = `${group.key}-${acc.role}`;
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-bg/50 p-2.5"
                  >
                    <div>
                      <p className="text-xs text-muted">{acc.role}</p>
                      <p className="font-bold">
                        {acc.bank} {acc.number}
                      </p>
                      <p className="text-xs text-muted">예금주: {acc.holder}</p>
                    </div>
                    <button
                      onClick={() => copy(acc.number, key)}
                      className="flex items-center gap-1 rounded bg-accent px-2.5 py-1.5 text-xs font-bold text-accent-fg"
                    >
                      {copied === key ? <Check size={12} /> : <Copy size={12} />}
                      {copied === key ? '복사완료' : '복사'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
