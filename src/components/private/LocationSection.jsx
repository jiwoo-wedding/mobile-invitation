import React, { useState } from 'react';
import { Copy, Check, Phone } from 'lucide-react';
import { CONFIG } from '../../config/invitationConfig';
import { locationImage } from '../../lib/assets';
import SectionTitle from '../common/SectionTitle';

/** 🔒 내빈용 전용 — 오시는 길 */
export default function LocationSection() {
  const [copied, setCopied] = useState('');
  const { venue, hall, address, addressJibun, tel, tel2, mapLinks, transport } = CONFIG.wedding;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  // 링크가 비어 있는 지도는 버튼을 만들지 않는다
  const maps = [
    { key: 'naver', label: '네이버지도', url: mapLinks?.naver },
    { key: 'kakao', label: '카카오맵', url: mapLinks?.kakao },
    { key: 'google', label: '구글지도', url: mapLinks?.google },
  ].filter((m) => m.url);

  return (
    <section className="space-y-4 px-5 py-6">
      <SectionTitle label="LOCATION" sub="오시는 길" />

      <div className="space-y-2 text-center">
        <p className="text-lg font-bold">{venue}</p>
        {hall && <p className="text-sm text-ink/80">{hall}</p>}
        <p className="text-sm text-muted">{address}</p>
        {addressJibun && <p className="text-xs text-muted/80">지번 · {addressJibun}</p>}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => copy(address, 'address')}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line/40 py-3 text-sm font-bold text-accent"
        >
          {copied === 'address' ? <Check size={15} /> : <Copy size={15} />}
          {copied === 'address' ? '복사했습니다' : '주소 복사'}
        </button>

        {tel && (
          <a
            href={`tel:${tel}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line/40 py-3 text-sm font-bold text-accent"
          >
            <Phone size={15} />
            전화하기
          </a>
        )}
      </div>

      {maps.length > 0 && (
        <div className="flex gap-2">
          {maps.map((m) => (
            <a
              key={m.key}
              href={m.url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-xl bg-accent py-3 text-center text-sm font-bold text-accent-fg shadow"
            >
              {m.label}
            </a>
          ))}
        </div>
      )}

      {/*
        약도는 지도 버튼 아래에 둔다.
        위치는 지도 앱에서 확인하는 편이 정확하고, 약도는 주변 지형을
        한눈에 보는 보조 자료라서 그 다음 순서가 자연스럽다.
        src/assets/location/ 에 사진을 넣으면 자동으로 나타난다.
      */}
      {locationImage && (
        <figure className="space-y-2">
          <div className="w-full overflow-hidden rounded-2xl border border-line/30 bg-surface/50">
            <img
              src={locationImage}
              alt={`${venue} 약도`}
              loading="lazy"
              decoding="async"
              className="h-auto w-full object-contain"
            />
          </div>
          <figcaption className="text-center text-[11px] text-muted">
            약도를 누르면 크게 보실 수 있습니다
          </figcaption>
        </figure>
      )}

      <ul className="space-y-3 rounded-2xl border border-line/30 bg-surface/40 p-5">
        {transport.map((t) => (
          <li key={t.title} className="text-sm">
            <p className="font-bold text-accent">{t.title}</p>
            <p className="mt-0.5 whitespace-pre-line leading-6 text-ink/90">{t.text}</p>
          </li>
        ))}
      </ul>

      {tel2 && (
        <p className="text-center text-xs text-muted">
          매장 문의 ·{' '}
          <a href={`tel:${tel2}`} className="text-accent underline">
            {tel2}
          </a>
        </p>
      )}
    </section>
  );
}
