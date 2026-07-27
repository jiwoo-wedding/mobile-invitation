import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MapPin } from 'lucide-react';
import { galleryGroups, galleryImages } from '../../lib/assets';
import { CONFIG } from '../../config/invitationConfig';
import SectionTitle from './SectionTitle';
import { useInView } from '../../hooks/useInView';

const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

export default function GallerySection() {
  const groups = galleryGroups;
  const images = galleryImages; // 그룹 순서대로 이어붙인 전체 목록
  const step = CONFIG.gallery.initialCount;

  // 그룹마다 몇 장까지 펼쳤는지 따로 기억한다. { 'Hachiman Zaka': 6, ... }
  const [shown, setShown] = useState(() =>
    Object.fromEntries(groups.map((g) => [g.folder, step]))
  );

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

  const iconButton =
    'grid size-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/20 active:scale-90 disabled:opacity-35 disabled:active:scale-100';

  /** 확대 보기에서 현재 사진이 어느 장소인지 찾는다 */
  const groupOfIndex = (i) => {
    let start = 0;
    for (const group of groups) {
      if (i < start + group.images.length) return group;
      start += group.images.length;
    }
    return null;
  };

  const currentGroup = index === null ? null : groupOfIndex(index);

  /**
   * 확대 보기를 document.body 로 빼낸다.
   * Reveal 컴포넌트가 transform 을 쓰기 때문에, 그 안에서 position:fixed 를
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

        {/* 지금 보고 있는 사진의 장소 이름 (지도 링크) */}
        {currentGroup && zoom === 1 && (
          <div className="fixed left-1/2 top-4 -translate-x-1/2">
            {currentGroup.mapUrl ? (
              <a
                href={currentGroup.mapUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`${currentGroup.title} 구글 지도에서 보기`}
                className="flex items-center gap-1.5 rounded-full bg-black/55 px-3.5 py-2 text-xs text-white/90 ring-1 ring-white/15 transition hover:bg-black/70"
              >
                {currentGroup.title}
                <MapPin size={13} className="opacity-75" aria-hidden="true" />
              </a>
            ) : (
              <span className="rounded-full bg-black/55 px-3.5 py-2 text-xs text-white/85 ring-1 ring-white/15">
                {currentGroup.title}
              </span>
            )}
          </div>
        )}

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

  // 그룹별로 전체 목록에서의 시작 위치를 미리 계산해 둔다 (확대 보기 인덱스용)
  let offset = 0;
  const blocks = groups.map((group) => {
    const block = { ...group, offset };
    offset += group.images.length;
    return block;
  });

  return (
    <section className="px-5 py-6">
      <SectionTitle label="GALLERY" sub="사진을 누르면 크게 보실 수 있습니다" />

      <div className="space-y-8">
        {blocks.map((group) => (
          <GalleryGroupBlock
            key={group.folder}
            group={group}
            step={step}
            limit={shown[group.folder] ?? step}
            onOpen={setIndex}
            onExpand={() =>
              setShown((prevShown) => ({
                ...prevShown,
                [group.folder]: (prevShown[group.folder] ?? step) + step,
              }))
            }
            onCollapse={() => setShown((prevShown) => ({ ...prevShown, [group.folder]: step }))}
          />
        ))}
      </div>

      {lightbox}
    </section>
  );
}

/**
 * 장소 하나의 블록.
 * 격자가 화면에 들어오는 순간부터 칸이 순서대로 나타난다.
 */
function GalleryGroupBlock({ group, step, limit, onOpen, onExpand, onCollapse }) {
  const [gridRef, inView] = useInView();

  const visible = group.images.slice(0, limit);
  const remaining = group.images.length - limit;

  return (
    <div>
      {/* 장소 제목이 곧 구글 지도 링크 */}
      <div className="mb-3">
        <h3 className="font-batang text-base font-bold text-accent">
          {group.mapUrl ? (
            <a
              href={group.mapUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${group.title} 구글 지도에서 보기`}
              className="inline-flex items-baseline gap-1.5 underline decoration-accent/40 decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {group.title}
              <MapPin size={13} className="translate-y-px opacity-70" aria-hidden="true" />
            </a>
          ) : (
            group.title
          )}
        </h3>

        {group.caption && <p className="mt-1 text-[11px] text-muted">{group.caption}</p>}
      </div>

      {/* 가로 3열 격자 — 화면에 들어오면 칸이 순서대로 나타난다 */}
      <div
        ref={gridRef}
        className={`grid grid-cols-3 gap-1.5 ${inView ? 'cells-in' : ''}`}
      >
        {visible.map((src, i) => (
          <button
            key={src}
            onClick={() => onOpen(group.offset + i)}
            aria-label={`${group.title} ${i + 1}번째 사진 크게 보기`}
            className="gallery-cell group aspect-square overflow-hidden rounded-md border border-line/20"
            style={{ animationDelay: `${i * 60}ms` }}
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
          onClick={onExpand}
          className="mt-3 w-full rounded-xl border border-line/40 py-2.5 text-xs font-bold text-accent transition-colors hover:bg-accent/10"
        >
          {group.title} 사진 더 보기 ({remaining}장)
        </button>
      )}

      {remaining <= 0 && group.images.length > step && (
        <button
          onClick={onCollapse}
          className="mt-3 w-full rounded-xl border border-line/20 py-2.5 text-[11px] text-muted"
        >
          접기
        </button>
      )}
    </div>
  );
}
