# mobile-invitation

직계가족 중심 소규모 예식을 위한 모바일 청첩장. **하나의 프로젝트에서 두 개의 링크**로 분기합니다.

| 링크 | 대상 | 노출 |
| --- | --- | --- |
| `https://<계정>.github.io/mobile-invitation/` | 지인 · 직장 동료 | 인사말, D-day, 갤러리, 안내 말씀, 연락처, 방명록 |
| `https://<계정>.github.io/mobile-invitation/?type=guest` | 직계가족 · 친지 | 위 항목 **+ 오시는 길 · 예식 안내 · 참석 여부 · 계좌** |

- **Frontend** React 18 + Vite 5 + Tailwind CSS 3
- **Backend** Supabase (`rsvp_submissions`, `guestbook_messages`)
- **배포** GitHub Pages (GitHub Actions 자동 빌드)

---

## 1. 시작하기

```bash
npm install
cp .env.local.example .env.local   # Supabase 를 쓸 때만
npm run dev
```

`http://localhost:5173/mobile-invitation/` 로 접속합니다.
내빈용 화면을 보려면 뒤에 `?type=guest` 를 붙이세요.

---

## 2. 폴더 구조

```
mobile-invitation/
├─ public/images/          # 사진 (숫자 파일명, README 참고)
│  ├─ hero/1.jpg
│  ├─ story/1.jpg ...
│  ├─ gallery/1.jpg ...
│  ├─ location/1.jpg       # 약도 — 내빈용에만 사용
│  └─ og/1.jpg             # 카카오톡 공유 썸네일
│
├─ src/
│  ├─ components/
│  │  ├─ common/           # 두 링크 모두에 노출
│  │  │  ├─ CurtainCover.jsx      # 초대장 열기 화면
│  │  │  ├─ HeroSection.jsx
│  │  │  ├─ GreetingSection.jsx   # 인사말 (링크 종류별 문구 자동 변경)
│  │  │  ├─ DdaySection.jsx       # D-day 카운트다운
│  │  │  ├─ StorySection.jsx
│  │  │  ├─ GallerySection.jsx    # 갤러리 + 확대 보기
│  │  │  ├─ ContactSection.jsx    # 연락처 모달
│  │  │  ├─ GuestbookSection.jsx  # 방명록 (Supabase)
│  │  │  ├─ SectionTitle.jsx
│  │  │  ├─ SectionDivider.jsx
│  │  │  └─ Footer.jsx            # 링크 종류별 공유 링크 복사
│  │  │
│  │  ├─ private/          # 🔒 내빈 전용
│  │  │  ├─ LocationSection.jsx   # 오시는 길
│  │  │  ├─ InfoSection.jsx       # 예식 안내
│  │  │  ├─ AccountSection.jsx    # 계좌 (아코디언)
│  │  │  └─ RsvpSection.jsx       # 참석 여부
│  │  │
│  │  └─ public/           # 📢 외부 알림 전용
│  │     └─ NoticeSection.jsx     # 소규모 예식 안내 말씀
│  │
│  ├─ pages/
│  │  ├─ GuestPage.jsx            # 내빈용 조합
│  │  └─ AnnouncementPage.jsx     # 외부용 조합
│  │
│  ├─ config/
│  │  ├─ invitationConfig.js      # ★ 신랑신부 · 날짜 · 계좌 · 문구
│  │  └─ themes.js                # 13개 테마 색상 토큰
│  │
│  ├─ hooks/useInvitation.js      # URL 파라미터 → 종류 · 테마 결정
│  ├─ lib/{assets,format,supabase}.js
│  ├─ styles/globals.css
│  ├─ App.jsx
│  └─ main.jsx
│
├─ supabase/migrations/20251025_init.sql
└─ .github/workflows/deploy.yml
```

---

## 3. 내 정보로 바꾸기

거의 모든 내용은 **`src/config/invitationConfig.js` 한 파일**에서 수정합니다.
파일 안의 순서 = 실제 화면에 보이는 순서입니다.

주의할 점:
- 따옴표 `" "`, 쉼표 `,`, 중괄호 `{ }` 를 지우면 화면이 하얗게 됩니다.
- 줄바꿈은 `\n`, 문단 사이 빈 줄은 `\n\n`.
- **카카오톡 공유 미리보기(제목 · 설명 · 썸네일)만은 예외**입니다.
  카카오톡은 링크를 읽을 때 JavaScript 를 실행하지 않으므로
  `index.html` 의 `og:` 메타 태그를 직접 고쳐야 합니다.
  수정 후 [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 캐시를 초기화하세요.

---

## 4. 테마 바꾸기

`invitationConfig.js` 의 `theme` 한 줄만 바꾸면 전체 색이 바뀝니다.

```js
theme: 'midnight-navy',
```

| id | 설명 |
| --- | --- |
| `signature-olive` | 다크 올리브 + 라임 (기본) |
| `original-warm` | 따뜻한 베이지, 클래식 |
| `classic-elegant` | 아이보리, 우아함 |
| `modern-minimal` | 흑백 모노톤 |
| `romantic-flower` | 소프트 핑크, 로즈골드 |
| `nature-green` | 세이지 그린 |
| `luxury-gold` | 다크 네이비 + 골드 |
| `simple-clean` | 순백/회색 |
| `vintage-film` | 세피아 필름 |
| `watercolor-soft` | 수채화 파스텔 |
| `midnight-navy` | 딥 네이비 별빛 |
| `pastel-dream` | 캔디 파스텔 |
| `korean-traditional` | 한지 · 단청 |

고르는 동안에는 주소 뒤에 `?theme=luxury-gold` 를 붙여 바로 비교할 수 있습니다.
(`allowThemePreview: true` 일 때만 동작하며, 테마를 정한 뒤에는 `false` 로 바꾸세요.)

테마는 **색상 토큰만** 정의합니다. 레이아웃(최대 480px 중앙 정렬)과
폰트(제목 Gowun Batang / 본문 Noto Sans KR)는 모든 테마가 공유하므로,
섹션을 하나 고치면 13개 테마에 동시에 반영됩니다.

---

## 5. Supabase 연결 (선택)

연결하지 않으면 방명록 · 참석 여부 섹션이 **자동으로 숨겨집니다.** 나머지는 그대로 동작합니다.

1. [supabase.com](https://supabase.com)에서 프로젝트를 만듭니다.
2. SQL Editor 에 `supabase/migrations/20251025_init.sql` 을 붙여넣고 실행합니다.
3. Settings → API 에서 Project URL 과 anon key 를 복사해 `.env.local` 에 넣습니다.
4. GitHub Actions 로 배포한다면 같은 값을 레포지토리
   Settings → Secrets and variables → Actions 에도 등록합니다.

RLS 정책상 `rsvp_submissions` 는 **제출만 가능하고 조회는 막혀 있습니다.**
하객 명단은 Supabase 대시보드에서 확인하세요.

---

## 6. 배포

1. GitHub 에 레포지토리를 만들고 코드를 푸시합니다. (이름이 `mobile-invitation` 이 아니면
   `vite.config.js` 의 `base` 를 레포 이름으로 바꾸세요.)
2. Settings → Pages → Source 를 **GitHub Actions** 로 설정합니다.
3. `main` 에 푸시할 때마다 자동으로 빌드 · 배포됩니다. (1~2분 소요)

수정이 반영되지 않으면 `Ctrl + Shift + R`(Mac `Cmd + Shift + R`)로 강제 새로고침하세요.

---

## 7. 링크 분기에 대해 (읽어주세요)

`?type=guest` 는 **접근 제어가 아니라 화면 분기**입니다. 주소를 아는 사람은 누구나 붙여볼 수 있습니다.
그래서 이 프로젝트는 두 가지를 지켜뒀습니다.

- `AnnouncementPage.jsx` 는 계좌 · 장소 컴포넌트를 **import 하지 않습니다.**
  숨기는 게 아니라 아예 불러오지 않으므로, 외부용 화면만 본 사람의 브라우저에는
  계좌 정보가 내려가지 않습니다. (Vite 가 코드를 분리해 주기 때문입니다.)
- 그럼에도 `?type=guest` 를 직접 입력하면 계좌가 보입니다. 이 부분까지 막고 싶다면
  `useInvitation.js` 의 판별 조건을 추측하기 어려운 값으로 바꾸세요.
  예: `params.get('to') === 'a7f3k2'` → 내빈용 링크는 `?to=a7f3k2`.

**참고:** 첨부해 주신 규칙 문서에는 "외부 알림용(`?type=guest`)" 이라고 적혀 있었는데,
기존 `App.jsx` 코드와 README 기준으로는 `?type=guest` 가 **내빈용**입니다.
코드 쪽을 정답으로 보고 구현했습니다. 반대로 쓰고 싶으시면 알려주세요.
