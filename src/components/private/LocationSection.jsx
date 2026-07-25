import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { CONFIG } from '../../config/invitationConfig';
import { locationImage } from '../../lib/assets';
import SectionTitle from '../common/SectionTitle';

/** 🔒 내빈용 전용 — 오시는 길 */
export default function LocationSection() {
  const [copied, setCopied] = useState(false);
  const { venue, hall, address, tel, mapLinks, transport } = CONFIG.wedding;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-4 px-5 py-6">
      <SectionTitle label="LOCATION" sub="오시는 길" />

      {locationImage && (
        <div className="h-64 w-full overflow-hidden rounded-2xl border border-line/30 bg-surface/50">
          <img
            src={locationImage}
            alt="예식장 약도"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="space-y-2 pt-2 text-center">
        <p className="text-lg font-bold">
          {venue} {hall}
        </p>
        <p className="text-sm text-muted">{address}</p>
        <a href={`tel:${tel}`} className="inline-block text-sm text-accent underline">
          {tel}
        </a>
      </div>

      <button
        onClick={copyAddress}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-line/40 py-3 text-sm font-bold text-accent"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? '주소를 복사했습니다' : '주소 복사'}
      </button>

      <div className="flex gap-3">
        <a
          href={mapLinks.kakao}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-xl bg-accent py-3 text-center text-sm font-bold text-accent-fg shadow"
        >
          카카오맵
        </a>
        <a
          href={mapLinks.naver}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-xl bg-accent py-3 text-center text-sm font-bold text-accent-fg shadow"
        >
          네이버지도
        </a>
      </div>

      <ul className="space-y-3 rounded-2xl border border-line/30 bg-surface/40 p-5">
        {transport.map((t) => (
          <li key={t.title} className="text-sm">
            <p className="font-bold text-accent">{t.title}</p>
            <p className="mt-0.5 leading-6 text-ink/90">{t.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
