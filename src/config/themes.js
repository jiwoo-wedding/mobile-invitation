/**
 * 테마 토큰 정의
 *
 * 가이드(하망이의 무료 모바일 청첩장)의 12개 테마 + 기존 프로젝트의 시그니처 올리브 테마.
 * 테마는 "색상 + 배경 패턴"만 바꾼다. 레이아웃(480px 중앙정렬)과 폰트
 * (제목 Gowun Batang / 본문 Noto Sans KR)는 전 테마 공통이다.
 *
 * 색상 역할
 *  - page      : 480px 컨테이너 바깥쪽 여백 배경
 *  - bg        : 청첩장 본문 배경
 *  - surface   : 카드/패널 배경
 *  - accent    : 포인트 색 (버튼, 제목, 테두리)
 *  - accentFg  : accent 위에 올라가는 글자색
 *  - text      : 본문 글자색
 *  - muted     : 보조 설명 글자색
 *  - border    : 테두리 색 (보통 accent 와 동일)
 */

export const THEMES = {
  'signature-olive': {
    id: 'signature-olive',
    label: '시그니처 올리브',
    description: '다크 올리브 + 라임. 이 프로젝트의 기본 테마',
    mode: 'dark',
    pattern: 'dots',
    colors: {
      page: '#1a1c14',
      bg: '#474a37',
      surface: '#2f3327',
      accent: '#d8e592',
      accentFg: '#474a37',
      text: '#f1f3e8',
      muted: '#b9bfa4',
      border: '#d8e592',
    },
  },

  'original-warm': {
    id: 'original-warm',
    label: '오리지널 웜',
    description: '따뜻한 베이지 톤, 클래식한 느낌',
    mode: 'light',
    pattern: 'none',
    colors: {
      page: '#EDE4D6',
      bg: '#F7F1E8',
      surface: '#FFFDF8',
      accent: '#B08D5F',
      accentFg: '#FFFFFF',
      text: '#4A3F35',
      muted: '#8B7B6B',
      border: '#B08D5F',
    },
  },

  'classic-elegant': {
    id: 'classic-elegant',
    label: '클래식 엘레강트',
    description: '우아한 세리프, 아이보리 컬러',
    mode: 'light',
    pattern: 'none',
    colors: {
      page: '#EFE9DC',
      bg: '#FBF9F4',
      surface: '#FFFFFF',
      accent: '#96814F',
      accentFg: '#FFFFFF',
      text: '#2E2A24',
      muted: '#7A7268',
      border: '#96814F',
    },
  },

  'modern-minimal': {
    id: 'modern-minimal',
    label: '모던 미니멀',
    description: '흑백 모노톤, 깔끔한 여백',
    mode: 'light',
    pattern: 'none',
    colors: {
      page: '#E8E8E8',
      bg: '#FFFFFF',
      surface: '#F5F5F5',
      accent: '#111111',
      accentFg: '#FFFFFF',
      text: '#111111',
      muted: '#6E6E6E',
      border: '#111111',
    },
  },

  'romantic-flower': {
    id: 'romantic-flower',
    label: '로맨틱 플라워',
    description: '소프트 핑크, 로즈골드 꽃 장식',
    mode: 'light',
    pattern: 'none',
    colors: {
      page: '#F6E3E4',
      bg: '#FDF4F3',
      surface: '#FFFFFF',
      accent: '#B0616F',
      accentFg: '#FFFFFF',
      text: '#4A3438',
      muted: '#94787D',
      border: '#B0616F',
    },
  },

  'nature-green': {
    id: 'nature-green',
    label: '네이처 그린',
    description: '세이지 그린, 보태니컬 자연 느낌',
    mode: 'light',
    pattern: 'none',
    colors: {
      page: '#E3E9DC',
      bg: '#F2F5EF',
      surface: '#FFFFFF',
      accent: '#6C8059',
      accentFg: '#FFFFFF',
      text: '#2F3A2B',
      muted: '#6D7A67',
      border: '#6C8059',
    },
  },

  'luxury-gold': {
    id: 'luxury-gold',
    label: '럭셔리 골드',
    description: '다크 네이비 + 골드, 프리미엄',
    mode: 'dark',
    pattern: 'stars',
    colors: {
      page: '#070C18',
      bg: '#10182B',
      surface: '#17213A',
      accent: '#C9A227',
      accentFg: '#10182B',
      text: '#F2EDE3',
      muted: '#A9B0C0',
      border: '#C9A227',
    },
  },

  'simple-clean': {
    id: 'simple-clean',
    label: '심플 클린',
    description: '순백/회색, 장식 완전 제거',
    mode: 'light',
    pattern: 'none',
    colors: {
      page: '#F0F0F0',
      bg: '#FFFFFF',
      surface: '#F7F7F7',
      accent: '#4A4A4A',
      accentFg: '#FFFFFF',
      text: '#222222',
      muted: '#7C7C7C',
      border: '#D6D6D6',
    },
  },

  'vintage-film': {
    id: 'vintage-film',
    label: '빈티지 필름',
    description: '세피아 필름, 폴라로이드 감성',
    mode: 'light',
    pattern: 'grain',
    colors: {
      page: '#DFD3C0',
      bg: '#EFE7DA',
      surface: '#F8F3E9',
      accent: '#7C5C3E',
      accentFg: '#F8F3E9',
      text: '#3B2F24',
      muted: '#7E6E5C',
      border: '#7C5C3E',
    },
  },

  'watercolor-soft': {
    id: 'watercolor-soft',
    label: '워터컬러 소프트',
    description: '수채화 파스텔, 몽환적 분위기',
    mode: 'light',
    pattern: 'none',
    colors: {
      page: '#E8E3F4',
      bg: '#F5F3FA',
      surface: '#FFFFFF',
      accent: '#8377B8',
      accentFg: '#FFFFFF',
      text: '#3D3752',
      muted: '#807A9C',
      border: '#8377B8',
    },
  },

  'midnight-navy': {
    id: 'midnight-navy',
    label: '미드나잇 네이비',
    description: '딥 네이비, 은하수 별빛 로맨틱',
    mode: 'dark',
    pattern: 'stars',
    colors: {
      page: '#060A15',
      bg: '#0B1224',
      surface: '#131C33',
      accent: '#9FB4E2',
      accentFg: '#0B1224',
      text: '#E9EEF9',
      muted: '#9AA7C2',
      border: '#9FB4E2',
    },
  },

  'pastel-dream': {
    id: 'pastel-dream',
    label: '파스텔 드림',
    description: '캔디 파스텔, 귀엽고 사랑스러운',
    mode: 'light',
    pattern: 'none',
    colors: {
      page: '#FCE7EE',
      bg: '#FFF6F9',
      surface: '#FFFFFF',
      accent: '#D96D96',
      accentFg: '#FFFFFF',
      text: '#4B3A44',
      muted: '#8D7A83',
      border: '#D96D96',
    },
  },

  'korean-traditional': {
    id: 'korean-traditional',
    label: '한국 전통',
    description: '한지 질감, 단청 색감',
    mode: 'light',
    pattern: 'hanji',
    colors: {
      page: '#E7D9BE',
      bg: '#F5EDDC',
      surface: '#FCF7EC',
      accent: '#A8352A',
      accentFg: '#F5EDDC',
      text: '#3A2E22',
      muted: '#7C6A55',
      border: '#A8352A',
    },
  },
};

/** 테마 선택 UI 등에서 쓰는 배열 형태 */
export const THEME_LIST = Object.values(THEMES);

/** '#d8e592' → '216 229 146' (Tailwind 투명도 유틸을 쓰기 위한 형식) */
function hexToRgbTriplet(hex) {
  const v = hex.replace('#', '');
  const full = v.length === 3 ? v.split('').map((c) => c + c).join('') : v;
  const num = parseInt(full, 16);
  return `${(num >> 16) & 255} ${(num >> 8) & 255} ${num & 255}`;
}

/** camelCase → kebab-case (accentFg → accent-fg) */
function toKebab(key) {
  return key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
}

/**
 * 테마를 문서 전체에 적용한다.
 * CSS 변수를 :root 에 주입하므로 Tailwind 클래스(bg-accent, text-ink 등)가
 * 자동으로 새 테마 색을 따라간다.
 */
export function applyTheme(themeId) {
  const theme = THEMES[themeId] ?? THEMES['signature-olive'];
  const root = document.documentElement;

  Object.entries(theme.colors).forEach(([key, hex]) => {
    const name = toKebab(key);
    root.style.setProperty(`--c-${name}`, hex);
    root.style.setProperty(`--c-${name}-rgb`, hexToRgbTriplet(hex));
  });

  root.dataset.pattern = theme.pattern;
  root.dataset.mode = theme.mode;

  return theme;
}
