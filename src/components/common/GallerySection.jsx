import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MapPin } from 'lucide-react';
import { galleryGroups, galleryImages } from '../../lib/assets';
import { CONFIG } from '../../config/invitationConfig';
import SectionTitle from './SectionTitle';
import { useInView } from '../../hooks/useInView';

const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.1;

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

  // 배율 100% = '화면에 꽉 차게 맞춘 크기' 가 되도록,
  // 사진의 원본 픽셀 크기와 보기 영역 크기를 재어 둔다.
  const [natural, setNatural] = useState(null); // { w, h } 사진 원본 픽셀
  const [viewport, setViewport] = useState({ w: 0, h: 0 }); // 여백을 뺀 보기 영역
  const touchRef = useRef(null);   // 한 손가락 스와이프 시작 x 좌표
  const pinchRef = useRef(null);   // 두 손가락 확대 시작 정보
  const scrollRef = useRef(null);
  const lightboxRef = useRef(null);
  const dragRef = useRef(null);   // 확대 후 마우스로 끌어 옮길 때의 시작 지점

  // 터치 처리는 네이티브 리스너로 붙이므로, 최신 zoom 값을 ref 로 따로 들고 있는다
  const zoomRef = useRef(1);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const close = () => setIndex(null);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  /*
    기준점을 유지하며 배율을 바꾼다.

    그냥 배율만 올리면 스크롤 위치가 그대로라 시선이 왼쪽 위로 쏠린다.
    확대 전에 '기준점이 콘텐츠 안의 어느 지점인지' 비율로 기억해 두고,
    확대 후 그 지점이 화면상 같은 자리에 오도록 스크롤을 다시 맞춘다.

    point 는 화면 좌표 { x, y }. 없으면 보고 있는 영역의 한가운데를 쓴다.
  */
  const zoomTo = (nextZoom, point) => {
    const el = scrollRef.current;
    const target = Math.min(MAX_ZOOM, Math.max(1, nextZoom));

    if (!el) {
      setZoom(target);
      return;
    }

    const rect = el.getBoundingClientRect();

    // 기준점 (요소 안에서의 위치)
    const px = point ? point.x - rect.left : rect.width / 2;
    const py = point ? point.y - rect.top : rect.height / 2;

    // 그 지점이 콘텐츠 전체에서 차지하는 비율
    const ratio = target / zoomRef.current;
    const nextLeft = (el.scrollLeft + px) * ratio - px;
    const nextTop = (el.scrollTop + py) * ratio - py;

    setZoom(target);

    // 새 크기가 적용된 다음 프레임에 스크롤을 옮긴다
    requestAnimationFrame(() => {
      const node = scrollRef.current;
      if (!node) return;
      node.scrollLeft = nextLeft;
      node.scrollTop = nextTop;
    });
  };

  // zoom 대신 zoomRef 를 쓰는 이유: 키보드 핸들러가 useEffect 안에 등록돼
  // 오래된 zoom 값을 붙잡고 있을 수 있다. ref 는 항상 최신값이다.
  const zoomIn = (point) => zoomTo(zoomRef.current + ZOOM_STEP, point);
  const zoomOut = (point) => zoomTo(zoomRef.current - ZOOM_STEP, point);

  // 사진을 바꾸면 확대 배율과 스크롤 위치를 초기화한다
  useEffect(() => {
    setZoom(1);
    setNatural(null);
    if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
  }, [index]);

  // 보기 영역 크기를 재고, 창 크기나 화면 회전에 맞춰 갱신한다
  useEffect(() => {
    if (index === null) return;

    const measure = () => {
      const el = scrollRef.current;
      if (!el) return;
      // p-4 여백(좌우/상하 각 16px)을 뺀 실제 사진 자리
      setViewport({ w: el.clientWidth - 32, h: el.clientHeight - 32 });
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
    확대 보기 안에서만 두 손가락 확대/축소(핀치)를 처리한다.

    index.html 의 뷰포트가 user-scalable=no 라 브라우저 기본 핀치는 막혀 있다.
    청첩장 본문이 통째로 확대돼 레이아웃이 깨지는 걸 막기 위한 설정이라 그대로 두고,
    사진을 볼 때만 여기서 직접 배율을 계산한다.

    React 의 onTouchMove 는 passive 로 붙을 수 있어 preventDefault 가 무시된다.
    그래서 네이티브 리스너로 { passive: false } 를 명시해 붙인다.
  */
  useEffect(() => {
    if (index === null) return;
    const el = lightboxRef.current;
    if (!el) return;

    /** 두 손가락 사이 거리 */
    const distance = (touches) =>
      Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );

    /** 두 손가락의 중간 지점 (화면 좌표) */
    const midpoint = (touches) => ({
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    });

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        // 확대 시작 — 스와이프는 취소한다
        pinchRef.current = { startDistance: distance(e.touches), startZoom: zoomRef.current };
        touchRef.current = null;
      } else if (e.touches.length === 1 && zoomRef.current === 1) {
        // 원본 크기일 때만 좌우 스와이프로 사진을 넘긴다
        touchRef.current = e.touches[0].clientX;
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length !== 2 || !pinchRef.current) return;

      e.preventDefault(); // 확대 중 화면이 같이 움직이지 않도록

      const ratio = distance(e.touches) / pinchRef.current.startDistance;
      const next = pinchRef.current.startZoom * ratio;

      // 1 에 가까우면 원본으로 붙여 준다 (손을 떼기 전에 화면이 흔들리지 않게)
      // 두 손가락 사이를 기준으로 삼아, 벌리는 지점이 화면에 그대로 남게 한다
      zoomTo(next < 1.05 ? 1 : next, midpoint(e.touches));
    };

    const onTouchEnd = (e) => {
      if (e.touches.length < 2) pinchRef.current = null;

      if (touchRef.current === null) return;

      const delta = e.changedTouches[0].clientX - touchRef.current;
      if (delta > 50) prev();
      if (delta < -50) next();
      touchRef.current = null;
    };

    /*
      iOS Safari 전용 처리.
      Safari 는 접근성을 이유로 user-scalable=no 를 무시하고 자체 핀치를 우선한다.
      그래서 두 손가락 제스처가 touchmove 까지 오지 않고 페이지 전체가 확대돼 버린다.
      gesture* 이벤트는 iOS Safari 에서만 발생하므로, 확대 보기가 열려 있는 동안
      이것을 막아 우리 코드가 배율을 직접 다루도록 한다.

      e.scale 은 Safari 가 계산해 주는 '처음 대비 몇 배' 값이라
      손가락 사이 거리를 직접 잴 필요가 없다.
    */
    const gestureStartZoom = { value: 1 };

    const gestureAnchor = { x: 0, y: 0 };

    const onGestureStart = (e) => {
      e.preventDefault();
      gestureStartZoom.value = zoomRef.current;
      gestureAnchor.x = e.clientX ?? window.innerWidth / 2;
      gestureAnchor.y = e.clientY ?? window.innerHeight / 2;
    };

    const onGestureChange = (e) => {
      e.preventDefault();
      const next = gestureStartZoom.value * e.scale;
      zoomTo(next < 1.05 ? 1 : next, gestureAnchor);
    };

    const onGestureEnd = (e) => e.preventDefault();

    el.addEventListener('gesturestart', onGestureStart, { passive: false });
    el.addEventListener('gesturechange', onGestureChange, { passive: false });
    el.addEventListener('gestureend', onGestureEnd, { passive: false });

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('gesturestart', onGestureStart);
      el.removeEventListener('gesturechange', onGestureChange);
      el.removeEventListener('gestureend', onGestureEnd);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [index, images.length]);

  /*
    확대한 뒤 사진을 끌어서 움직인다. (마우스 전용)

    확대 중에는 바깥 div 가 스크롤 컨테이너가 되므로,
    마우스를 누른 채 움직인 거리만큼 그 스크롤 위치를 반대로 밀어 준다.
    손가락은 브라우저 기본 스크롤이 더 부드러워서 그대로 둔다.
  */
  const onDragStart = (e) => {
    if (zoom === 1 || e.button !== 0) return;

    e.preventDefault(); // 사진이 브라우저 기본 드래그로 끌려가지 않도록

    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: scrollRef.current?.scrollLeft ?? 0,
      top: scrollRef.current?.scrollTop ?? 0,
    };
  };

  const onDragMove = (e) => {
    if (!dragRef.current || !scrollRef.current) return;

    scrollRef.current.scrollLeft = dragRef.current.left - (e.clientX - dragRef.current.x);
    scrollRef.current.scrollTop = dragRef.current.top - (e.clientY - dragRef.current.y);
  };

  const onDragEnd = () => {
    dragRef.current = null;
  };

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

  const onWheel = (e) => {
    if (!e.ctrlKey && Math.abs(e.deltaY) < 4) return;
    e.preventDefault();

    // 커서가 가리키는 지점을 기준으로 확대·축소한다
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
    배율 100% 일 때의 크기를 먼저 구한다.

    예전에는 확대할 때 '컨테이너 폭의 zoom%' 로 잡았는데,
    세로 사진은 화면에 맞춘 폭이 컨테이너의 절반도 안 되기 때문에
    110% 로 올리는 순간 실제로는 세 배 가까이 커져 버렸다.
    원본 픽셀 크기와 보기 영역을 비교해 '맞춘 크기'를 구하고,
    거기에 배율을 곱하면 110% 가 눈에 보이는 그대로 110% 가 된다.
  */
  const fitScale =
    natural && viewport.w > 0 && viewport.h > 0
      ? Math.min(viewport.w / natural.w, viewport.h / natural.h)
      : null;

  const displaySize = fitScale
    ? {
        width: Math.round(natural.w * fitScale * zoom),
        height: Math.round(natural.h * fitScale * zoom),
      }
    : undefined;

  /**
   * 확대 보기를 document.body 로 빼낸다.
   * Reveal 컴포넌트가 transform 을 쓰기 때문에, 그 안에서 position:fixed 를
   * 쓰면 화면이 아니라 섹션 박스가 기준이 되어 사진이 480px 폭에 잘린다.
   */
  const lightbox =
    index !== null &&
    createPortal(
      <div
        ref={lightboxRef}
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

        {/* 사진 영역: 원본 크기면 화면에 맞추고, 확대하면 스크롤해서 본다 */}
        <div
          ref={scrollRef}
          onWheel={onWheel}
          onClick={() => zoom === 1 && close()}
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          className={
            zoom === 1
              ? 'absolute inset-0 grid place-items-center overflow-hidden p-4'
              : 'scrollbar-hide absolute inset-0 grid cursor-grab select-none place-items-center overflow-auto overscroll-contain p-4 active:cursor-grabbing'
          }
        >
          {/*
            크기를 잰 뒤에는 배율과 상관없이 계산한 픽셀 값만 쓴다.

            예전에는 100% 일 때만 CSS(object-contain)로 맞추고 확대할 때만 계산값을 썼는데,
            두 방식의 결과가 미묘하게 달라서 100% -> 110% 로 올리는 순간
            오히려 작아지는 일이 있었다. 한 가지 방식으로 통일하면 그 경계가 사라진다.
            (아직 크기를 못 잰 로딩 직후에만 CSS 로 맞춘다)
          */}
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
            className={
              displaySize
                ? `block max-w-none rounded-lg ring-1 ring-white/20 ${
                    zoom === 1 ? 'lightbox-image shadow-[0_28px_70px_rgba(0,0,0,0.7)]' : ''
                  }`
                : 'lightbox-image max-h-full max-w-full rounded-lg object-contain shadow-[0_28px_70px_rgba(0,0,0,0.7)] ring-1 ring-white/20'
            }
            style={displaySize}
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
