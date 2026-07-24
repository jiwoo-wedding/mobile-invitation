/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // 색상은 전부 CSS 변수를 바라본다.
      // <alpha-value> 를 써야 bg-surface/40 같은 투명도 유틸이 동작한다.
      colors: {
        page: 'rgb(var(--c-page-rgb) / <alpha-value>)',
        bg: 'rgb(var(--c-bg-rgb) / <alpha-value>)',
        surface: 'rgb(var(--c-surface-rgb) / <alpha-value>)',
        accent: 'rgb(var(--c-accent-rgb) / <alpha-value>)',
        'accent-fg': 'rgb(var(--c-accent-fg-rgb) / <alpha-value>)',
        ink: 'rgb(var(--c-text-rgb) / <alpha-value>)',
        muted: 'rgb(var(--c-muted-rgb) / <alpha-value>)',
        line: 'rgb(var(--c-border-rgb) / <alpha-value>)',
      },
      fontFamily: {
        batang: ['"Gowun Batang"', 'serif'],
        sans: ['"Noto Sans KR"', 'sans-serif'],
      },
      maxWidth: { mobile: '480px' },
    },
  },
  plugins: [],
};
