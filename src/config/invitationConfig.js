/**
 * 청첩장 설정 파일 — 여기만 수정하면 됩니다.
 *
 * 아래 순서는 실제 청첩장에 보이는 순서와 같습니다. 위에서 아래로 읽으며 고치세요.
 * 주의: 따옴표(" "), 쉼표(,), 중괄호({ })를 지우면 화면이 하얗게 됩니다.
 *       줄바꿈은 \n, 문단 사이 빈 줄은 \n\n 을 사용하세요.
 */

export const CONFIG = {
  // ── 1. 테마 ─────────────────────────────────────
  // src/config/themes.js 의 id 중 하나를 넣으세요.
  // signature-olive / original-warm / classic-elegant / modern-minimal /
  // romantic-flower / nature-green / luxury-gold / simple-clean /
  // vintage-film / watercolor-soft / midnight-navy / pastel-dream / korean-traditional
  theme: 'signature-olive',

  // ?theme=luxury-gold 처럼 URL 로 테마를 바꿔보며 고를 수 있게 할지 여부.
  // 고를 테마를 정했다면 false 로 바꾸세요.
  allowThemePreview: true,

  // ── 2. 초대장 열기 화면 ──────────────────────────
  useCurtain: true,

  // ── 3. 신랑 · 신부 ──────────────────────────────
  couple: {
    groom: {
      name: '신랑이름',
      order: '장남', // 장남 / 차남 / 아들 ...
      father: '신랑아버지',
      mother: '신랑어머니',
      fatherDeceased: false, // true 면 이름 앞에 故 가 붙습니다
      motherDeceased: false,
      tel: '010-0000-0000',
      fatherTel: '010-0000-0000',
      motherTel: '010-0000-0000',
    },
    bride: {
      name: '신부이름',
      order: '장녀',
      father: '신부아버지',
      mother: '신부어머니',
      fatherDeceased: false,
      motherDeceased: false,
      tel: '010-0000-0000',
      fatherTel: '010-0000-0000',
      motherTel: '010-0000-0000',
    },
  },

  // ── 4. 예식 정보 ────────────────────────────────
  wedding: {
    date: '2025-10-25', // YYYY-MM-DD
    time: '13:00', // 24시간 형식
    venue: 'OO웨딩홀',
    hall: '3층 단독홀',
    address: '서울특별시 OO구 OO로 123',
    tel: '02-000-0000',
    mapLinks: {
      // 카카오맵/네이버지도에서 예식장 검색 → 공유 → URL 복사
      kakao: 'https://map.kakao.com',
      naver: 'https://map.naver.com',
    },
    // 오시는 길 안내 (내빈용에만 노출)
    transport: [
      { title: '지하철', text: 'O호선 OO역 3번 출구 도보 5분' },
      { title: '버스', text: 'OO정류장 하차 — 100, 200, 300번' },
      { title: '주차', text: '건물 지하 2시간 무료 (예식장 안내데스크에서 확인)' },
    ],
  },

  // ── 5. 사진 ─────────────────────────────────────
  // 파일은 public/images/ 아래에 1.jpg, 2.jpg ... 순서대로 넣으세요.
  photos: {
    hero: 1, // public/images/hero/1.jpg
    story: 2, // public/images/story/1.jpg ~
    gallery: 9, // public/images/gallery/1.jpg ~
    location: 1, // public/images/location/1.jpg (약도)
  },

  // ── 6. 우리의 이야기 ────────────────────────────
  story: [
    { title: '처음 만난 날', text: '2019년 봄,\n같은 동아리에서 처음 마주쳤습니다.' },
    { title: '함께한 시간', text: '여섯 번의 계절을 지나\n서로의 하루가 되었습니다.' },
  ],

  // ── 7. 마음 전하실 곳 (계좌) — 내빈용에만 노출 ──
  accounts: {
    groom: [
      { role: '신랑', bank: 'OO은행', number: '110-123-456789', holder: '신랑이름' },
      { role: '아버지', bank: 'OO은행', number: '110-123-456789', holder: '신랑아버지' },
    ],
    bride: [
      { role: '신부', bank: 'OO은행', number: '3333-01-1234567', holder: '신부이름' },
      { role: '어머니', bank: 'OO은행', number: '3333-01-1234567', holder: '신부어머니' },
    ],
  },

  // ── 8. 공유 문구 ────────────────────────────────
  // ⚠️ 카카오톡 미리보기(제목/설명/썸네일)는 이 값이 아니라 index.html 의 og 태그를 고쳐야 합니다.
  share: {
    title: '신랑이름 ♥ 신부이름 결혼합니다',
    description: '2025년 10월 25일 토요일 오후 1시',
  },
};

/**
 * 초대장 종류별 노출 규칙과 문구
 *
 *  - announcement (기본, URL 파라미터 없음) : 지인·직장 동료용.
 *      장소 / 계좌 / RSVP 를 노출하지 않습니다.
 *  - guest (?type=guest)                    : 직계가족·친지용. 전체 노출.
 */
export const INVITATION_CONFIG = {
  // 🔒 내빈용 (직계가족 / 친인척)
  guest: {
    type: 'guest',
    showLocation: true,
    showInfo: true,
    showAccount: true,
    showRsvp: true,
    showNotice: false,
    greetingTitle: 'INVITATION',
    greetingText: `오랜 시간 걸음 지키며\n서로의 하루가 되어주었습니다.\n\n이제 부부라는 이름으로\n같은 방향을 걸어가려 합니다.\n\n이 뜻깊은 시작의 자리에\n소중한 분들을 정중히 초대합니다.`,
  },

  // 📢 외부용 (지인 / 직장 동료)
  announcement: {
    type: 'announcement',
    showLocation: false,
    showInfo: false,
    showAccount: false,
    showRsvp: false,
    showNotice: true,
    greetingTitle: 'WEDDING ANNOUNCEMENT',
    greetingText: `저희 두 사람이 소중한 분들의 축복 속에\n뜻깊은 시작을 함께하게 되었습니다.\n\n양가 직계가족분들만 모시고\n간소하게 식을 올리게 되었음을\n너른 마음으로 양해 부탁드립니다.\n\n멀리서 보내주시는 따뜻한 축하만으로도\n큰 기쁨과 힘이 됩니다.`,
  },
};

export default CONFIG;
