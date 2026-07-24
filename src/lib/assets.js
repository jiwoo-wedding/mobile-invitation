/**
 * GitHub Pages 는 /<레포이름>/ 하위 경로로 배포되므로
 * 이미지 경로 앞에 항상 BASE_URL 을 붙여야 한다.
 */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

/** images/gallery/1.jpg ~ n.jpg 목록을 만든다 */
export const numberedImages = (folder, count) =>
  Array.from({ length: count }, (_, i) => asset(`images/${folder}/${i + 1}.jpg`));
