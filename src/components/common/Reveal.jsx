import React, { useEffect, useRef, useState } from 'react';

/**
 * 스크롤해서 화면에 들어올 때 한 번만 부드럽게 나타나는 래퍼.
 *
 * 모션 최소화 설정을 켠 사용자에게도 효과를 보여준다.
 * 대신 globals.css 에서 이동(transform) 없이 페이드만 되도록 처리한다.
 *
 * IntersectionObserver 를 지원하지 않는 아주 오래된 브라우저에서는
 * 내용이 아예 안 보이면 안 되므로 즉시 표시한다.
 */
export default function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // 한 번 나타나면 다시 감추지 않는다
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
