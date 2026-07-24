import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 주소가 https://<계정>.github.io/mobile-invitation/ 형태이므로
// base 를 레포지토리 이름으로 맞춘다. 커스텀 도메인을 쓰면 '/' 로 변경.
export default defineConfig({
  plugins: [react()],
  base: '/mobile-invitation/',
});
