import { useEffect, useRef, useState } from 'react';

/**
 * 화면에 들어왔는지 알려주는 훅. 한 번 들어오면 계속 true 로 둔다.
 *
 * 갤러리 격자처럼 "스크롤해서 도달했을 때" 애니메이션을 시작해야 하는 곳에 쓴다.
 * 페이지가 열릴 때 한 번에 재생해 버리면, 아래쪽 섹션은 사용자가 도착하기 전에
 * 애니메이션이 끝나 있어서 아무 효과도 못 본다.
 */
export function useInView({ threshold = 0.15, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 아주 오래된 브라우저에서는 효과 없이 바로 보여준다
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
}
