/**
 * 이미지 경로 자동 수집
 *
 * src/assets/<폴더>/ 안의 이미지를 빌드 시점에 전부 찾아온다.
 * 파일명 규칙이 없어도 되고, 사진을 넣거나 빼면 코드 수정 없이 반영된다.
 * 정렬은 사람이 보는 순서(자연 정렬)를 따른다. 예: img2.jpg < img10.jpg
 *
 * 갤러리는 장소별 하위 폴더로 나눈다.
 *   src/assets/gallery/Akarenga Warehouse/aka01.jpg
 *   src/assets/gallery/Hachiman Zaka/hachi01.jpg
 *   src/assets/gallery/Trappist Monastery/trapi01.jpg
 *
 * 폴더 이름과 화면에 보일 제목·지도 링크는
 * src/config/invitationConfig.js 의 gallery.groups 에서 연결한다.
 *
 * 주의: import.meta.glob 의 경로와 옵션은 변수를 쓸 수 없다.
 *       Vite 가 빌드 전에 정적으로 읽어야 해서 반드시 리터럴이어야 한다.
 */
import { CONFIG } from '../config/invitationConfig';

const GALLERY_ROOT = '../assets/gallery/';

// ** 를 쓰면 하위 폴더 안의 파일까지 전부 찾는다 (폴더에 바로 둔 파일도 포함)
const galleryModules = import.meta.glob(
  '../assets/gallery/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?url', import: 'default' }
);

const storyModules = import.meta.glob('../assets/story/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const locationModules = import.meta.glob(
  '../assets/location/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?url', import: 'default' }
);

/** 경로 기준 자연 정렬 */
function sortEntries(entries) {
  return entries.sort(([a], [b]) =>
    a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' })
  );
}

/** 경로 기준 자연 정렬 후 URL 배열로 변환 */
function toSortedUrls(modules) {
  return sortEntries(Object.entries(modules)).map(([, url]) => url);
}

/**
 * '../assets/gallery/Hachiman Zaka/hachi01.jpg' → 'Hachiman Zaka'
 * 하위 폴더 없이 gallery 에 바로 둔 파일은 '' (빈 문자열)을 반환한다.
 */
function folderNameOf(filePath) {
  const rest = filePath.replace(GALLERY_ROOT, '');
  const parts = rest.split('/');
  return parts.length > 1 ? parts[0] : '';
}

// 폴더 이름 → 그 폴더의 이미지 URL 배열
const byFolder = {};
for (const [filePath, url] of sortEntries(Object.entries(galleryModules))) {
  const folder = folderNameOf(filePath);
  (byFolder[folder] ??= []).push(url);
}

/**
 * 갤러리 그룹 목록.
 * 순서는 config 의 gallery.groups 순서를 따른다.
 * config 에 적지 않은 폴더가 있으면 뒤에 그대로 붙인다(사진이 사라지지 않게).
 */
const configuredGroups = CONFIG.gallery?.groups ?? [];
const configuredFolders = new Set(configuredGroups.map((g) => g.folder));

export const galleryGroups = [
  ...configuredGroups
    .map((group) => ({
      ...group,
      images: byFolder[group.folder] ?? [],
    }))
    .filter((group) => group.images.length > 0),

  ...Object.keys(byFolder)
    .filter((folder) => !configuredFolders.has(folder))
    .sort((a, b) => a.localeCompare(b, 'ko'))
    .map((folder) => ({
      folder,
      title: folder || '기타',
      caption: '',
      mapUrl: '',
      images: byFolder[folder],
    })),
];

/** 그룹 순서대로 이어붙인 전체 목록 (확대 보기에서 앞뒤로 넘길 때 사용) */
export const galleryImages = galleryGroups.flatMap((group) => group.images);

export const storyImages = toSortedUrls(storyModules);
export const locationImage = toSortedUrls(locationModules)[0] ?? null;

/** { 'trapi03.jpg': '/assets/trapi03-a1b2c3.jpg', ... } 형태의 조회용 맵 */
const galleryByName = Object.fromEntries(
  Object.entries(galleryModules).map(([filePath, url]) => [filePath.split('/').pop(), url])
);

/**
 * 첫 화면 대표 사진.
 * CONFIG.mainPhoto 에 적은 파일명을 src/assets/gallery 전체(하위 폴더 포함)에서 찾는다.
 * 이름이 안 맞으면 갤러리 첫 장으로 대신한다.
 */
const requestedMain = CONFIG.mainPhoto;

if (import.meta.env.DEV && requestedMain && !galleryByName[requestedMain]) {
  console.warn(
    `[청첩장] mainPhoto '${requestedMain}' 를 src/assets/gallery 에서 찾지 못했습니다. ` +
      `사용 가능한 파일: ${Object.keys(galleryByName).sort().join(', ')}`
  );
}

if (import.meta.env.DEV) {
  const missing = configuredGroups.filter((g) => !(byFolder[g.folder]?.length > 0));
  if (missing.length > 0) {
    console.warn(
      `[청첩장] 사진이 없는 갤러리 폴더: ${missing.map((g) => g.folder).join(', ')}. ` +
        `src/assets/gallery 아래 폴더 이름과 config 의 folder 값이 같은지 확인하세요. ` +
        `현재 발견된 폴더: ${Object.keys(byFolder).map((f) => f || '(최상단)').join(', ')}`
    );
  }
}

export const mainImage = galleryByName[requestedMain] ?? galleryImages[0] ?? null;

/** 갤러리 파일명으로 이미지 주소를 직접 찾을 때 */
export const galleryImageByName = (filename) => galleryByName[filename] ?? null;
