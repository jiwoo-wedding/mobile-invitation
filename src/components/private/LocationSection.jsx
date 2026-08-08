import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Copy, Check, Phone, X, ZoomIn, ZoomOut } from 'lucide-react';
import { CONFIG } from '../../config/invitationConfig';
import { locationImage } from '../../lib/assets';
import SectionTitle from '../common/SectionTitle';

const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** 🔒 내빈용 전용 — 오시는 길 */
export default function LocationSection() {
  const [copied, setCopied] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const { venue, hall, address, addressJibun, tel, tel2, mapLinks, transport } = CONFIG.wedding;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

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

      {/* 약도 — 누르면 전체 화면으로 크게 본다 */}
      {locationImage && (
        <figure className="space-y-2">
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            aria-label="약도 크게 보기"
            className="block w-full overflow-hidden rounded-2xl border border-line/30 bg-surface/50"
          >
            <img
              src={locationImage}
              alt={`${venue} 약도`}
              loading="lazy"
              decoding="async"
              className="h-auto w-full object-contain"
            />
          </button>
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

      {mapOpen && (
        <MapLightbox src={locationImage} alt={`${venue} 약도`} onClose={() => setMapOpen(false)} />
      )}
    </section>
  );
}

/**
 * 약도 전용 확대 보기.
 * 갤러리와 같은 원리(transform 기반)의 단순화 버전 —
 * 두 손가락 확대(iOS gesture 포함), 확대 후 끌어서 이동, 더블탭 2배.
 */
function MapLightbox({ src, alt, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const stageRef = useRef(null);
  const zoomRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const pinchRef = useRef(null);

  const apply = (nextZoom, nextOffset) => {
    const z = clamp(nextZoom, 1, MAX_ZOOM);
    const limit = 600 * (z - 1); // 이동 범위 대략 제한
    const o = { x: clamp(nextOffset.x, -limit, limit), y: clamp(nextOffset.y, -limit, limit) };
    zoomRef.current = z;
    offsetRef.current = o;
    setZoom(z);
    setOffset(o);
  };

  const zoomTo = (nextZoom, point) => {
    const stage = stageRef.current;
    const z1 = zoomRef.current;
    const target = clamp(nextZoom, 1, MAX_ZOOM);
    if (!stage || !point) {
      apply(target, offsetRef.current);
      return;
    }
    const rect = stage.getBoundingClientRect();
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const ratio = target / z1;
    const o1 = offsetRef.current;
    apply(target, {
      x: point.x - center.x - ratio * (point.x - center.x - o1.x),
      y: point.y - center.y - ratio * (point.y - center.y - o1.y),
    });
  };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);

    const distance = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const midpoint = (t) => ({
      x: (t[0].clientX + t[1].clientX) / 2,
      y: (t[0].clientY + t[1].clientY) / 2,
    });
    const hasGesture = 'ongesturestart' in window;

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        pinchRef.current = { d: distance(e.touches), z: zoomRef.current };
        dragRef.current = null;
      } else if (e.touches.length === 1 && zoomRef.current > 1) {
        dragRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          o: offsetRef.current,
        };
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2 && pinchRef.current && !hasGesture) {
        e.preventDefault();
        const next = pinchRef.current.z * (distance(e.touches) / pinchRef.current.d);
        zoomTo(next < 1.05 ? 1 : next, midpoint(e.touches));
        return;
      }
      if (e.touches.length === 1 && dragRef.current) {
        e.preventDefault();
        apply(zoomRef.current, {
          x: dragRef.current.o.x + (e.touches[0].clientX - dragRef.current.x),
          y: dragRef.current.o.y + (e.touches[0].clientY - dragRef.current.y),
        });
      }
    };
    const onTouchEnd = (e) => {
      if (e.touches.length < 2) pinchRef.current = null;
      if (e.touches.length === 0) dragRef.current = null;
    };

    const gesture = { z: 1, p: { x: 0, y: 0 } };
    const onGestureStart = (e) => {
      e.preventDefault();
      gesture.z = zoomRef.current;
      gesture.p = { x: e.clientX ?? window.innerWidth / 2, y: e.clientY ?? window.innerHeight / 2 };
      dragRef.current = null;
    };
    const onGestureChange = (e) => {
      e.preventDefault();
      if (typeof e.clientX === 'number') gesture.p = { x: e.clientX, y: e.clientY };
      const next = gesture.z * e.scale;
      zoomTo(next < 1.05 ? 1 : next, gesture.p);
    };
    const onGestureEnd = (e) => e.preventDefault();

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });
    el.addEventListener('gesturestart', onGestureStart, { passive: false });
    el.addEventListener('gesturechange', onGestureChange, { passive: false });
    el.addEventListener('gestureend', onGestureEnd, { passive: false });

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      el.removeEventListener('gesturestart', onGestureStart);
      el.removeEventListener('gesturechange', onGestureChange);
      el.removeEventListener('gestureend', onGestureEnd);
    };
  }, [onClose]);

  /* 마우스 끌기 (PC) */
  const onMouseDown = (e) => {
    if (zoomRef.current === 1 || e.button !== 0) return;
    e.preventDefault();
    dragRef.current = { x: e.clientX, y: e.clientY, o: offsetRef.current };
  };
  const onMouseMove = (e) => {
    if (!dragRef.current) return;
    apply(zoomRef.current, {
      x: dragRef.current.o.x + (e.clientX - dragRef.current.x),
      y: dragRef.current.o.y + (e.clientY - dragRef.current.y),
    });
  };
  const onMouseUp = () => {
    dragRef.current = null;
  };
  const onWheel = (e) => {
    if (!e.ctrlKey && Math.abs(e.deltaY) < 4) return;
    e.preventDefault();
    const point = { x: e.clientX, y: e.clientY };
    zoomTo(zoomRef.current + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP), point);
  };

  const iconButton =
    'grid size-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/20 active:scale-90 disabled:opacity-35';

  return createPortal(
    <div
      className="lightbox fixed inset-0 z-[100] bg-black/85"
      role="dialog"
      aria-modal="true"
      aria-label="약도 크게 보기"
    >
      <div
        ref={stageRef}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={() => zoom === 1 && onClose()}
        className={`absolute inset-0 grid touch-none place-items-center overflow-hidden p-3 ${
          zoom === 1 ? '' : 'cursor-grab select-none active:cursor-grabbing'
        }`}
      >
        <img
          src={src}
          alt={alt}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => zoomTo(zoom === 1 ? 2 : 1, { x: e.clientX, y: e.clientY })}
          draggable={false}
          className="max-h-full max-w-full rounded-lg bg-white ring-1 ring-white/20"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          }}
        />
      </div>

      <button onClick={onClose} aria-label="닫기" className={`${iconButton} fixed right-4 top-4`}>
        <X size={20} />
      </button>

      <div className="fixed bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        <button
          onClick={() => zoomTo(zoomRef.current - ZOOM_STEP)}
          disabled={zoom <= 1}
          aria-label="축소"
          className={`${iconButton} size-10`}
        >
          <ZoomOut size={17} />
        </button>
        <p className="whitespace-nowrap rounded-full bg-black/55 px-3 py-2 text-xs tabular-nums text-white/85 ring-1 ring-white/15">
          {Math.round(zoom * 100)}%
        </p>
        <button
          onClick={() => zoomTo(zoomRef.current + ZOOM_STEP)}
          disabled={zoom >= MAX_ZOOM}
          aria-label="확대"
          className={`${iconButton} size-10`}
        >
          <ZoomIn size={17} />
        </button>
      </div>
    </div>,
    document.body
  );
}
