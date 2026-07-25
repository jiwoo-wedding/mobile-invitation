import React, { useState } from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { supabase, isSupabaseReady } from '../../lib/supabase';
import { formatFullDate, formatTime } from '../../lib/format';
import SectionTitle from '../common/SectionTitle';

const INITIAL = { side: 'groom', name: '', attending: 'yes', headcount: 1, meal: 'yes', note: '' };

/** 🔒 내빈용 전용 — 참석 여부 (RSVP) */
export default function RsvpSection() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');

  if (!isSupabaseReady) return null;

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = async () => {
    if (!form.name.trim()) {
      setError('성함을 입력해 주세요.');
      return;
    }

    setStatus('sending');
    setError('');

    const { error: err } = await supabase.from('rsvp_submissions').insert({
      side: form.side,
      name: form.name.trim(),
      attending: form.attending === 'yes',
      headcount: Number(form.headcount) || 1,
      meal: form.meal === 'yes',
      note: form.note.trim() || null,
    });

    if (err) {
      setStatus('error');
      setError('전달하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    setStatus('done');
  };

  if (status === 'done') {
    return (
      <section className="px-5 py-6">
        <SectionTitle label="R.S.V.P" sub="참석 여부" />
        <div className="rounded-2xl border border-line/30 bg-surface/40 p-8 text-center">
          <p className="font-batang text-lg font-bold text-accent">전달했습니다</p>
          <p className="mt-2 text-sm leading-7 text-ink/90">
            소중한 시간 내어 답변해 주셔서 감사합니다.
            <br />
            예식 당일 뵙겠습니다.
          </p>
          <button
            onClick={() => {
              setForm(INITIAL);
              setStatus('idle');
            }}
            className="mt-4 text-xs text-muted underline"
          >
            다른 분 참석 여부 남기기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-6">
      <SectionTitle label="R.S.V.P" sub="참석 여부를 알려주세요" />

      <p className="mb-4 text-center text-xs leading-6 text-muted">
        {formatFullDate()} {formatTime()}
        <br />
        {CONFIG.wedding.venue} {CONFIG.wedding.hall}
      </p>

      <div className="space-y-3 rounded-2xl border border-line/30 bg-surface/40 p-5 text-sm">
        <Choice
          label="어느 분의 손님이신가요"
          value={form.side}
          onChange={(v) => set({ side: v })}
          options={[
            { value: 'groom', label: '신랑측' },
            { value: 'bride', label: '신부측' },
          ]}
        />

        <Field label="성함">
          <input
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            maxLength={20}
            className="w-full rounded-lg border border-line/30 bg-bg/60 px-3 py-2"
          />
        </Field>

        <Choice
          label="참석 여부"
          value={form.attending}
          onChange={(v) => set({ attending: v })}
          options={[
            { value: 'yes', label: '참석' },
            { value: 'no', label: '불참' },
          ]}
        />

        {form.attending === 'yes' && (
          <>
            <Field label="총 인원">
              <input
                type="number"
                min={1}
                max={20}
                value={form.headcount}
                onChange={(e) => set({ headcount: e.target.value })}
                className="w-full rounded-lg border border-line/30 bg-bg/60 px-3 py-2"
              />
            </Field>

            <Choice
              label="식사 여부"
              value={form.meal}
              onChange={(v) => set({ meal: v })}
              options={[
                { value: 'yes', label: '식사함' },
                { value: 'no', label: '식사 안 함' },
              ]}
            />
          </>
        )}

        <Field label="남기실 말씀 (선택)">
          <textarea
            value={form.note}
            onChange={(e) => set({ note: e.target.value })}
            rows={2}
            maxLength={200}
            className="w-full resize-none rounded-lg border border-line/30 bg-bg/60 px-3 py-2"
          />
        </Field>

        {error && <p className="text-xs text-accent">{error}</p>}

        <button
          onClick={submit}
          disabled={status === 'sending'}
          className="w-full rounded-lg bg-accent py-3 font-bold text-accent-fg disabled:opacity-60"
        >
          {status === 'sending' ? '전달하는 중' : '참석 여부 전달하기'}
        </button>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-muted">{label}</span>
      {children}
    </label>
  );
}

function Choice({ label, value, onChange, options }) {
  return (
    <div className="space-y-1">
      <span className="text-xs text-muted">{label}</span>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`flex-1 rounded-lg border py-2 text-sm ${
              value === opt.value
                ? 'border-line bg-accent font-bold text-accent-fg'
                : 'border-line/30 text-ink/80'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
