import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CONFIG } from '../../config/invitationConfig';
import { numberedImages } from '../../lib/assets';
import SectionTitle from './SectionTitle';

export default function GallerySection() {
  const images = numberedImages('gallery', CONFIG.photos.gallery);
  const [index, setIndex] = useState(null); // null 이면 확대 보기 닫힘

  const close = () => setIndex(null);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  // 확대 보기가 열려 있는 동안 배경 스크롤을 막고 키보드 조작을 지원한다
  useEffect(() => {
    if (index === null) return;

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [index]);

  return (
    <section className="py-6">
      <SectionTitle label="GALLERY" sub="사진을 누르면 크게 보실 수 있습니다" />

      <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-6">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setIndex(i)}
            className="h-96 w-72 shrink-0 snap-center overflow-hidden rounded-2xl border border-line/30"
          >
            <img
              src={src}
              alt={`갤러리 사진 ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {index !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label="사진 크게 보기"
        >
          <button
            onClick={close}
            aria-label="닫기"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
          >
            <X size={20} />
          </button>

          <button
            onClick={prev}
            aria-label="이전 사진"
            className="absolute left-2 rounded-full bg-white/10 p-2 text-white"
          >
            <ChevronLeft size={22} />
          </button>

          <img
            src={images[index]}
            alt={`갤러리 사진 ${index + 1}`}
            className="max-h-[80vh] max-w-[92vw] object-contain"
          />

          <button
            onClick={next}
            aria-label="다음 사진"
            className="absolute right-2 rounded-full bg-white/10 p-2 text-white"
          >
            <ChevronRight size={22} />
          </button>

          <p className="absolute bottom-6 text-xs text-white/70">
            {index + 1} / {images.length}
          </p>
        </div>
      )}
    </section>
  );
}
