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
      name: '장성빈',
      order: '첫째 아들', 
      father: '장재필',
      mother: '최미순',
      fatherDeceased: false, 
      motherDeceased: false,
      tel: '010-0000-0000',
      fatherTel: '010-0000-0000',
      motherTel: '010-0000-0000',
    },
    bride: {
      name: '엄지우',
      order: '둘째 딸',
      father: '엄길용',
      mother: '조영순',
      fatherDeceased: false,
      motherDeceased: false,
      tel: '010-0000-0000',
      fatherTel: '010-0000-0000',
      motherTel: '010-0000-0000',
    },
  },

  // ── 4. 예식 정보 ────────────────────────────────
  wedding: {
    date: '2026-12-19',
    time: '11:30',

    venue: '한식다이닝 이음',
    hall: '서울 영등포구 국제금융로 39',
    area: '',
    address: '브라이튼 여의도 상가 2층',
    addressJibun: '',
    tel: '0507-1426-7144',
    tel2: '010-2865-7733',

    mapLinks: {
      naver: 'https://naver.me/58jvx5Ox'
    },

    transport: [
      { title: '지하철', text: '5호선 여의나루역 · 5호선/9호선 여의도역 사이\n더현대 서울 바로 앞' },
      { title: '주차', text: '건물 지하 1층 3시간 무료\n지하 1층 외 구역은 주차 지원이 되지 않으며,\n건물 규정에 따라 10분당 1,500원이 부과됩니다.' },
    ],

    // INFORMATION 섹션 문구
    notes: [
      { title: '시간 안내', text: '11시 30분까지 오시면 됩니다.\n따로 예식은 없으니 편한 마음으로 와주세요.' },
      { title: '식사 안내', text: '정갈한 한식 코스로 식사를 준비했습니다.' },
      { title: '화환 안내', text: '마음만 감사히 받겠습니다. 화환은 정중히 사양합니다.' },
    ],
  },
  // ── 5. 사진 ─────────────────────────────────────
  // 파일은 src/assets/ 아래 폴더에 넣기만 하면 자동으로 인식됩니다.
  //   src/assets/gallery/<장소 폴더>/  갤러리 사진 (몇 장이든 자유, 파일명도 자유)
  //   src/assets/story/     우리 이야기 사진
  //   src/assets/location/  약도 1장
  // 카카오톡 썸네일만 예외로 public/og.jpg 에 둡니다.
  gallery: {
    // 그룹마다 처음에 보여줄 장수. 나머지는 '더 보기'로 펼칩니다.
    initialCount: 6,

    // 갤러리를 장소별로 나눕니다.
    //   folder : src/assets/gallery 아래 폴더 이름과 반드시 똑같이 적으세요 (대소문자·공백 포함)
    //   title  : 화면에 보일 제목
    //   caption: 제목 아래 한 줄 설명 (빈 문자열이면 안 나옵니다)
    //   mapUrl : 구글 지도 공유 링크. 빈 문자열이면 지도 버튼이 안 나옵니다.
    // 여기 적은 순서대로 화면에 나옵니다.
    groups: [
      {
        folder: 'akarenga_warehouse',
        title: '하코다테 베이의 붉은 벽돌 창고'
      },
      {
        folder: 'hachiman_zaka',
        title: '바다가 내려다보이는 언덕길'
      },
      {
        folder: 'trappist_monastery',
        title: '고요한 삼나무 길 끝의 수도원'
      },
    ],
  },

  // 첫 화면에 쓸 대표 사진.
  // 첫 화면 대표 사진. 아래 세 가지 방식 중 하나로 적습니다.
  //   'trappi12.jpg'                파일명 지정 (하위 폴더 안에 있어도 파일명만 적으면 됩니다)
  //   'random'                      갤러리 전체에서 무작위 — 열 때마다 바뀝니다
  //   'random:Trappist Monastery'   그 폴더 안에서만 무작위
  // 파일명이 안 맞으면 갤러리 첫 장이 대신 쓰이고, 개발 중에는 콘솔(F12)에 경고가 찍힙니다.
  mainPhoto: 'trappi12.jpg',

  // 대표 사진에서 화면에 보여줄 부분. 'X% Y%' 형식, 기본 가운데는 '50% 50%'.
  // ⚠️ mainPhoto 를 'random' 으로 두면 사진마다 구도가 달라서 이 값이 잘 맞지 않습니다.
  //    무작위로 쓰실 때는 '50% 50%' 로 두는 편이 안전합니다.
  //   X 를 키우면 사진이 왼쪽으로, 줄이면 오른쪽으로 움직입니다.
  //   Y 를 키우면 위로, 줄이면 아래로 움직입니다.
  // 5 단위로 바꿔가며 맞추는 게 편합니다.
  mainPhotoPosition: '53% 50%',

  // ── 6. 우리의 이야기 ────────────────────────────
  // 사진을 넣고 싶으면 src/assets/story/ 에 순서대로 넣으세요. (없으면 글만 나옵니다)
  story: [
    {
      title: '처음 만난 날',
      text: `2025년 봄,\n서로를 처음 마주했습니다.\n\n특별할 것 없던 하루였는데\n그날 이후로 계절이\n조금 다르게 흘렀습니다.`,
    },
    {
      title: '함께한 시간',
      text: `일곱 번의 계절을 지나며\n평범한 하루가 서로에게\n가장 소중한 하루가 되었습니다.\n\n이제 같은 방향을 보며\n오래 걸어가려 합니다.`,
    },
  ],

  // ── 7. 마음 전하실 곳 (계좌) — 내빈용에만 노출 ──
  accounts: {
    groom: [
      { role: '신랑', bank: 'OO은행', number: '110-123-456789', holder: '장성빈' },
      { role: '아버지', bank: 'OO은행', number: '110-123-456789', holder: '장재필' },
      { role: '어머니', bank: 'OO은행', number: '110-123-456789', holder: '최미순' },
    ],
    bride: [
      { role: '신부', bank: 'OO은행', number: '3333-01-1234567', holder: '엄지우' },
      { role: '아버지', bank: 'OO은행', number: '3333-01-1234567', holder: '엄길용' },
      { role: '어머니', bank: 'OO은행', number: '3333-01-1234567', holder: '조영순' },
    ],
  },

  // ── 8. 공유 문구 ────────────────────────────────
  // ⚠️ 카카오톡 미리보기(제목/설명/썸네일)는 이 값이 아니라 index.html 의 og 태그를 고쳐야 합니다.
  share: {
    title: '장성빈 ♥ 엄지우 결혼합니다',
    description: '2026년 12월 19일 토요일',
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
