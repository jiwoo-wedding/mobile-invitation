/**
 * 이미지 경로 자동 수집
 *
 * src/assets/<폴더>/ 안의 이미지를 빌드 시점에 전부 찾아온다.
 * 파일명 규칙이 없어도 되고, 사진을 넣거나 빼면 코드 수정 없이 반영된다.
 * 정렬은 사람이 보는 순서(자연 정렬)를 따른다. 예: img2.jpg < img10.jpg
 *
 * 주의: import.meta.glob 의 경로와 옵션은 변수를 쓸 수 없다.
 *       Vite 가 빌드 전에 정적으로 읽어야 해서 반드시 리터럴이어야 한다.
 */
import { CONFIG } from '../config/invitationConfig';

const galleryModules = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const storyModules = import.meta.glob('../assets/story/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const locationModules = import.meta.glob('../assets/location/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** 경로 기준 자연 정렬 후 URL 배열로 변환 */
function toSortedUrls(modules) {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }))
    .map(([, url]) => url);
}

/** { 'trapi03.jpg': '/assets/trapi03-a1b2c3.jpg', ... } 형태의 조회용 맵 */
const galleryByName = Object.fromEntries(
  Object.entries(galleryModules).map(([filePath, url]) => [filePath.split('/').pop(), url])
);

export const galleryImages = toSortedUrls(galleryModules);
export const storyImages = toSortedUrls(storyModules);
export const locationImage = toSortedUrls(locationModules)[0] ?? null;

/**
 * 첫 화면 대표 사진.
 * CONFIG.mainPhoto 에 적은 파일명을 src/assets/gallery 에서 찾는다.
 * 이름이 안 맞으면 갤러리 첫 장으로 대신한다.
 */
const requestedMain = CONFIG.mainPhoto;

if (import.meta.env.DEV && requestedMain && !galleryByName[requestedMain]) {
  console.warn(
    `[청첩장] mainPhoto '${requestedMain}' 를 src/assets/gallery 에서 찾지 못했습니다. ` +
      `사용 가능한 파일: ${Object.keys(galleryByName).sort().join(', ')}`
  );
}

export const mainImage = galleryByName[requestedMain] ?? galleryImages[0] ?? null;

/** 갤러리 파일명으로 이미지 주소를 직접 찾을 때 */
export const galleryImageByName = (filename) => galleryByName[filename] ?? null;
