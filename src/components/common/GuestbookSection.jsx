import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { supabase, isSupabaseReady } from '../../lib/supabase';
import SectionTitle from './SectionTitle';

export default function GuestbookSection() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const [error, setError] = useState('');

  const load = async () => {
    const { data, error: err } = await supabase
      .from('guestbook_messages')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false })
      .limit(30);

    if (!err) setMessages(data ?? []);
  };

  useEffect(() => {
    if (isSupabaseReady) load();
  }, []);

  // Supabase 를 아직 연결하지 않았다면 섹션을 숨긴다.
  if (!isSupabaseReady) return null;

  const submit = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      setError('이름과 메시지를 모두 입력해 주세요.');
      return;
    }

    setStatus('sending');
    setError('');

    const { error: err } = await supabase.from('guestbook_messages').insert({
      name: form.name.trim(),
      message: form.message.trim(),
    });

    if (err) {
      setStatus('error');
      setError('메시지를 남기지 못했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    setForm({ name: '', message: '' });
    setStatus('idle');
    load();
  };

  return (
    <section className="px-6 py-6">
      <SectionTitle label="GUESTBOOK" sub="따뜻한 축하 한마디를 남겨주세요" />

      <div className="space-y-2 rounded-2xl border border-line/30 bg-surface/40 p-4">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="이름"
          maxLength={20}
          className="w-full rounded-lg border border-line/30 bg-bg/60 px-3 py-2 text-sm placeholder:text-muted"
        />
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="축하 메시지"
          rows={3}
          maxLength={300}
          className="w-full resize-none rounded-lg border border-line/30 bg-bg/60 px-3 py-2 text-sm placeholder:text-muted"
        />
        {error && <p className="text-xs text-accent">{error}</p>}
        <button
          onClick={submit}
          disabled={status === 'sending'}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-bold text-accent-fg disabled:opacity-60"
        >
          <Send size={15} /> {status === 'sending' ? '남기는 중' : '메시지 남기기'}
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {messages.length === 0 && (
          <li className="py-6 text-center text-xs text-muted">
            첫 번째 축하 메시지를 남겨주세요.
          </li>
        )}
        {messages.map((m) => (
          <li key={m.id} className="rounded-xl border border-line/20 bg-surface/30 p-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold text-accent">{m.name}</span>
              <span className="text-[10px] text-muted">
                {new Date(m.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-ink/90">{m.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
