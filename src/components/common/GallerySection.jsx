import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { galleryImages } from '../../lib/assets';
import { CONFIG } from '../../config/invitationConfig';
import SectionTitle from './SectionTitle';

const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

export default function GallerySection() {
  const images = galleryImages;
  const step = CONFIG.gallery.initialCount;

  const [shown, setShown] = useState(step); // 격자에 보여줄 장수
  const [index, setIndex] = useState(null); // null 이면 확대 보기 닫힘
  const [zoom, setZoom] = useState(1);
  const touchRef = useRef(null);
  const scrollRef = useRef(null);

  const close = () => setIndex(null);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  const zoomOut = () => setZoom((z) => Math.max(1, z - ZOOM_STEP));

  // 사진을 바꾸면 확대 배율과 스크롤 위치를 초기화한다
  useEffect(() => {
    setZoom(1);
    if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
  }, [index]);

  // 확대 보기가 열려 있는 동안 배경 스크롤을 막고 키보드 조작을 지원한다
  useEffect(() => {
    if (index === null) return;

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [index]);

  if (images.length === 0) {
    return (
      <section className="px-5 py-6">
        <SectionTitle label="GALLERY" />
        <p className="rounded-2xl border border-dashed border-line/40 py-10 text-center text-xs text-muted">
          src/assets/gallery 폴더에 사진을 넣어주세요.
        </p>
      </section>
    );
  }

  // 원본 크기일 때만 스와이프로 사진을 넘긴다 (확대 중에는 스크롤이 우선)
  const onTouchStart = (e) => {
    touchRef.current = zoom === 1 && e.touches.length === 1 ? e.touches[0].clientX : null;
  };
  const onTouchEnd = (e) => {
    if (touchRef.current === null) return;
    const delta = e.changedTouches[0].clientX - touchRef.current;
    if (delta > 50) prev();
    if (delta < -50) next();
    touchRef.current = null;
  };

  const onWheel = (e) => {
    if (!e.ctrlKey && Math.abs(e.deltaY) < 4) return;
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  const visible = images.slice(0, shown);
  const remaining = images.length - shown;

  const iconButton =
    'grid size-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/20 active:scale-90 disabled:opacity-35 disabled:active:scale-100';

  /**
   * 확대 보기를 document.body 로 빼낸다.
   * Reveal 컴포넌트가 will-change/transform 을 쓰기 때문에, 그 안에서 position:fixed 를
   * 쓰면 화면이 아니라 섹션 박스가 기준이 되어 사진이 480px 폭에 잘린다.
   */
  const lightbox =
    index !== null &&
    createPortal(
      <div
        className="lightbox fixed inset-0 z-[100]"
        role="dialog"
        aria-modal="true"
        aria-label={`갤러리 사진 ${index + 1} / ${images.length}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* 보고 있는 사진을 크게 번지게 깔아 시선이 사진에 모이도록 */}
        <img
          src={images[index]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-40 blur-3xl"
        />
        <div className="absolute inset-0 bg-black/75" />

        {/* 사진 영역: 원본 크기면 화면에 맞추고, 확대하면 스크롤해서 본다 */}
        <div
          ref={scrollRef}
          onWheel={onWheel}
          onClick={() => zoom === 1 && close()}
          className={
            zoom === 1
              ? 'absolute inset-0 flex items-center justify-center overflow-hidden p-4'
              : 'absolute inset-0 overflow-auto overscroll-contain p-4'
          }
        >
          <img
            key={images[index]}
            src={images[index]}
            alt={`갤러리 사진 ${index + 1}`}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={() => setZoom((z) => (z === 1 ? 2.5 : 1))}
            className={
              zoom === 1
                ? 'lightbox-image max-h-full max-w-full rounded-lg object-contain shadow-[0_28px_70px_rgba(0,0,0,0.7)] ring-1 ring-white/20'
                : 'block max-w-none cursor-move rounded-lg ring-1 ring-white/20'
            }
            style={zoom === 1 ? undefined : { width: `${zoom * 100}%` }}
          />
        </div>

        {/* 조작 버튼 */}
        <button onClick={close} aria-label="닫기" className={`${iconButton} fixed right-4 top-4`}>
          <X size={20} />
        </button>

        <button
          onClick={prev}
          aria-label="이전 사진"
          className={`${iconButton} fixed left-3 top-1/2 -translate-y-1/2`}
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={next}
          aria-label="다음 사진"
          className={`${iconButton} fixed right-3 top-1/2 -translate-y-1/2`}
        >
          <ChevronRight size={22} />
        </button>

        <div className="fixed bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={zoom <= 1}
            aria-label="축소"
            className={`${iconButton} size-10`}
          >
            <ZoomOut size={17} />
          </button>

          <p className="rounded-full bg-black/55 px-3.5 py-2 text-xs tabular-nums text-white/85 ring-1 ring-white/15">
            {index + 1} / {images.length}
            {zoom > 1 && <span className="ml-2 text-white/60">{Math.round(zoom * 100)}%</span>}
          </p>

          <button
            onClick={zoomIn}
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

  return (
    <section className="px-5 py-6">
      <SectionTitle label="GALLERY" sub="사진을 누르면 크게 보실 수 있습니다" />

      {/* 가로 3열 격자 */}
      <div className="grid grid-cols-3 gap-1.5">
        {visible.map((src, i) => (
          <button
            key={src}
            onClick={() => setIndex(i)}
            aria-label={`${i + 1}번째 사진 크게 보기`}
            className="gallery-cell group aspect-square overflow-hidden rounded-md border border-line/20"
            style={{ animationDelay: `${(i % step) * 45}ms` }}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-active:scale-105"
            />
          </button>
        ))}
      </div>

      {remaining > 0 && (
        <button
          onClick={() => setShown((n) => n + step)}
          className="mt-4 w-full rounded-xl border border-line/40 py-3 text-sm font-bold text-accent transition-colors hover:bg-accent/10"
        >
          사진 더 보기 ({remaining}장)
        </button>
      )}

      {shown >= images.length && images.length > step && (
        <button
          onClick={() => setShown(step)}
          className="mt-4 w-full rounded-xl border border-line/20 py-3 text-xs text-muted"
        >
          접기
        </button>
      )}

      {lightbox}
    </section>
  );
}
