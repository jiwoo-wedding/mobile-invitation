import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MapPin } from 'lucide-react';
import { galleryGroups, galleryImages } from '../../lib/assets';
import { CONFIG } from '../../config/invitationConfig';
import { useInView } from '../../hooks/useInView';
import SectionTitle from './SectionTitle';

const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;
const SWIPE_THRESHOLD = 50;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function GallerySection() {
  const groups = galleryGroups;
  const images = galleryImages; // 그룹 순서대로 이어붙인 전체 목록
  const step = CONFIG.gallery.initialCount;

  // 그룹마다 몇 장까지 펼쳤는지 따로 기억한다
  const [shown, setShown] = useState(() =>
    Object.fromEntries(groups.map((g) => [g.folder, step]))
  );

  const [index, setIndex] = useState(null); // null 이면 확대 보기 닫힘
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // 화면 중심에서 밀어낸 거리(px)
  const [natural, setNatural] = useState(null); // 사진 원본 픽셀 { w, h }
  const [viewport, setViewport] = useState({ w: 0, h: 0 }); // 보기 영역

  const stageRef = useRef(null); // 사진이 놓이는 영역
  const zoomRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef(null); // 끌어서 옮기는 중의 시작 정보
  const pinchRef = useRef(null); // 두 손가락 확대 시작 정보
  const swipeRef = useRef(null); // 좌우로 넘기기 시작 x 좌표

  const close = () => setIndex(null);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  /* ── 배율 100% 일 때의 사진 크기 ────────────────
     원본 픽셀과 보기 영역을 비교해 '화면에 꽉 차게 맞춘 크기'를 구한다.
     확대는 이 크기에 배율을 곱하는 방식이라, 110% 가 눈에 보이는 그대로 110% 다. */
  const fitScale =
    natural && viewport.w > 0 && viewport.h > 0
      ? Math.min(viewport.w / natural.w, viewport.h / natural.h)
      : null;

  const baseWidth = fitScale ? natural.w * fitScale : 0;
  const baseHeight = fitScale ? natural.h * fitScale : 0;

  /* 확대해도 사진이 화면 밖으로 빠져나가지 않도록 이동 범위를 제한한다 */
  const clampOffset = (next, atZoom) => {
    const limitX = Math.max(0, (baseWidth * atZoom - viewport.w) / 2);
    const limitY = Math.max(0, (baseHeight * atZoom - viewport.h) / 2);
    return {
      x: clamp(next.x, -limitX, limitX),
      y: clamp(next.y, -limitY, limitY),
    };
  };

  const applyView = (nextZoom, nextOffset) => {
    const safeOffset = clampOffset(nextOffset, nextZoom);
    zoomRef.current = nextZoom;
    offsetRef.current = safeOffset;
    setZoom(nextZoom);
    setOffset(safeOffset);
  };

  /*
    기준점을 유지하며 배율을 바꾼다.

    사진은 화면 중앙을 기준으로 scale 되고 offset 만큼 밀려 있다.
    화면 좌표 p 아래에 있는 사진 위의 지점을 L 이라 하면
        p = center + offset + zoom * L
    확대 후에도 같은 p 에 L 이 오게 하려면
        offset2 = p - center - (zoom2 / zoom1) * (p - center - offset1)

    스크롤이 아니라 transform 으로 옮기기 때문에 브라우저가 개입하지 않는다.
    (iOS Safari 는 터치 제스처 중 프로그램이 지정한 스크롤을 되돌려서,
     스크롤 방식으로는 기준점 유지가 동작하지 않았다)
  */
  const zoomTo = (nextZoom, point) => {
    const stage = stageRef.current;
    const target = clamp(nextZoom, 1, MAX_ZOOM);

    if (!stage) {
      applyView(target, offsetRef.current);
      return;
    }

    const rect = stage.getBoundingClientRect();
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const p = point ?? center;

    const z1 = zoomRef.current;
    const o1 = offsetRef.current;
    const ratio = target / z1;

    applyView(target, {
      x: p.x - center.x - ratio * (p.x - center.x - o1.x),
      y: p.y - center.y - ratio * (p.y - center.y - o1.y),
    });
  };

  // 버튼과 키보드는 최신 배율을 ref 에서 읽는다 (오래된 상태 참조 방지)
  const zoomIn = (point) => zoomTo(zoomRef.current + ZOOM_STEP, point);
  const zoomOut = (point) => zoomTo(zoomRef.current - ZOOM_STEP, point);

  const resetView = () => {
    zoomRef.current = 1;
    offsetRef.current = { x: 0, y: 0 };
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // 사진을 바꾸면 배율과 위치를 초기화한다
  useEffect(() => {
    resetView();
    setNatural(null);
  }, [index]);

  // 보기 영역 크기를 재고, 창 크기나 화면 회전에 맞춰 갱신한다
  useEffect(() => {
    if (index === null) return;

    const measure = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      setViewport({ w: rect.width, h: rect.height });
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
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

  /*
    터치 조작.

    한 손가락
      배율 100%  : 좌우로 넘기면 다음/이전 사진
      확대 중    : 사진을 끌어서 옮긴다
    두 손가락    : 벌리고 오므려 확대·축소 (기준점은 두 손가락 사이)

    iOS Safari 는 gesturechange 와 touchmove 를 모두 발생시킨다.
    둘 다 배율을 바꾸면 한 프레임에 두 번 계산돼 기준점이 무시되므로,
    Safari 에서는 gesture* 쪽만 쓰고 touchmove 확대는 건너뛴다.
  */
  useEffect(() => {
    if (index === null) return;
    const el = stageRef.current;
    if (!el) return;

    const hasGestureEvents = 'ongesturestart' in window;

    const distance = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const midpoint = (t) => ({
      x: (t[0].clientX + t[1].clientX) / 2,
      y: (t[0].clientY + t[1].clientY) / 2,
    });

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        pinchRef.current = { startDistance: distance(e.touches), startZoom: zoomRef.current };
        swipeRef.current = null;
        dragRef.current = null;
        return;
      }

      if (e.touches.length !== 1) return;

      if (zoomRef.current === 1) {
        swipeRef.current = e.touches[0].clientX;
      } else {
        dragRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          offset: offsetRef.current,
        };
      }
    };

    const onTouchMove = (e) => {
      // 두 손가락 확대 (안드로이드 등)
      if (e.touches.length === 2 && pinchRef.current && !hasGestureEvents) {
        e.preventDefault();
        const ratio = distance(e.touches) / pinchRef.current.startDistance;
        const nextZoom = pinchRef.current.startZoom * ratio;
        zoomTo(nextZoom < 1.05 ? 1 : nextZoom, midpoint(e.touches));
        return;
      }

      // 확대 상태에서 한 손가락으로 끌어 옮기기
      if (e.touches.length === 1 && dragRef.current) {
        e.preventDefault();
        applyView(zoomRef.current, {
          x: dragRef.current.offset.x + (e.touches[0].clientX - dragRef.current.x),
          y: dragRef.current.offset.y + (e.touches[0].clientY - dragRef.current.y),
        });
      }
    };

    const onTouchEnd = (e) => {
      if (e.touches.length < 2) pinchRef.current = null;
      if (e.touches.length === 0) dragRef.current = null;

      if (swipeRef.current === null) return;

      const delta = e.changedTouches[0].clientX - swipeRef.current;
      if (delta > SWIPE_THRESHOLD) prev();
      if (delta < -SWIPE_THRESHOLD) next();
      swipeRef.current = null;
    };

    /* iOS Safari 전용 — 브라우저 기본 핀치를 막고 배율을 직접 다룬다 */
    const gesture = { startZoom: 1, anchor: { x: 0, y: 0 } };

    const onGestureStart = (e) => {
      e.preventDefault();
      gesture.startZoom = zoomRef.current;
      gesture.anchor = {
        x: typeof e.clientX === 'number' ? e.clientX : window.innerWidth / 2,
        y: typeof e.clientY === 'number' ? e.clientY : window.innerHeight / 2,
      };
      swipeRef.current = null;
      dragRef.current = null;
    };

    const onGestureChange = (e) => {
      e.preventDefault();
      if (typeof e.clientX === 'number') {
        gesture.anchor = { x: e.clientX, y: e.clientY };
      }
      const nextZoom = gesture.startZoom * e.scale;
      zoomTo(nextZoom < 1.05 ? 1 : nextZoom, gesture.anchor);
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
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      el.removeEventListener('gesturestart', onGestureStart);
      el.removeEventListener('gesturechange', onGestureChange);
      el.removeEventListener('gestureend', onGestureEnd);
    };
  }, [index, images.length, baseWidth, baseHeight, viewport.w, viewport.h]);

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

  /* 마우스로 끌어서 옮기기 */
  const onMouseDown = (e) => {
    if (zoom === 1 || e.button !== 0) return;
    e.preventDefault();
    dragRef.current = { x: e.clientX, y: e.clientY, offset: offsetRef.current };
  };

  const onMouseMove = (e) => {
    if (!dragRef.current) return;
    applyView(zoomRef.current, {
      x: dragRef.current.offset.x + (e.clientX - dragRef.current.x),
      y: dragRef.current.offset.y + (e.clientY - dragRef.current.y),
    });
  };

  const onMouseUp = () => {
    dragRef.current = null;
  };

  const onWheel = (e) => {
    if (!e.ctrlKey && Math.abs(e.deltaY) < 4) return;
    e.preventDefault();
    const point = { x: e.clientX, y: e.clientY };
    if (e.deltaY < 0) zoomIn(point);
    else zoomOut(point);
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

  /*
    확대 보기를 document.body 로 빼낸다.
    Reveal 컴포넌트가 transform 을 쓰기 때문에, 그 안에서 position:fixed 를
    쓰면 화면이 아니라 섹션 박스가 기준이 되어 사진이 잘린다.
  */
  const lightbox =
    index !== null &&
    createPortal(
      <div
        className="lightbox fixed inset-0 z-[100]"
        role="dialog"
        aria-modal="true"
        aria-label={`갤러리 사진 ${index + 1} / ${images.length}`}
      >
        {/* 보고 있는 사진을 크게 번지게 깔아 시선이 사진에 모이도록 */}
        <img
          src={images[index]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-40 blur-3xl"
        />
        <div className="absolute inset-0 bg-black/75" />

        {/*
          사진이 놓이는 영역.
          스크롤을 쓰지 않고 transform 으로만 위치를 정한다.
          touch-none 이라 브라우저 기본 스크롤·확대가 끼어들지 않는다.
        */}
        <div
          ref={stageRef}
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClick={() => zoom === 1 && close()}
          className={`absolute inset-0 touch-none overflow-hidden p-4 ${
            zoom === 1 ? '' : 'cursor-grab select-none active:cursor-grabbing'
          }`}
        >
          <img
            key={images[index]}
            src={images[index]}
            alt={`갤러리 사진 ${index + 1}`}
            onLoad={(e) =>
              setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
            }
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => zoomTo(zoom === 1 ? 2 : 1, { x: e.clientX, y: e.clientY })}
            draggable={false}
            className={`absolute left-1/2 top-1/2 max-w-none rounded-lg ring-1 ring-white/20 ${
              zoom === 1 ? 'lightbox-image shadow-[0_28px_70px_rgba(0,0,0,0.7)]' : ''
            }`}
            style={
              fitScale
                ? {
                    width: baseWidth,
                    height: baseHeight,
                    transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  }
                : { maxWidth: '100%', maxHeight: '100%', transform: 'translate(-50%, -50%)' }
            }
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

        <div className="fixed bottom-5 left-1/2 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-1.5">
          <button
            onClick={() => zoomOut()}
            disabled={zoom <= 1}
            aria-label="축소"
            className={`${iconButton} size-10`}
          >
            <ZoomOut size={17} />
          </button>

          <p className="whitespace-nowrap rounded-full bg-black/55 px-3 py-2 text-xs tabular-nums text-white/85 ring-1 ring-white/15">
            {index + 1}&nbsp;/&nbsp;{images.length}
            {zoom > 1 && <span className="ml-2 text-white/60">{Math.round(zoom * 100)}%</span>}
          </p>

          <button
            onClick={() => zoomIn()}
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
  let cursor = 0;
  const blocks = groups.map((group) => {
    const block = { ...group, offset: cursor };
    cursor += group.images.length;
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
      <div ref={gridRef} className={`grid grid-cols-3 gap-1.5 ${inView ? 'cells-in' : ''}`}>
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
