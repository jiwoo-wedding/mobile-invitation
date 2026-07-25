import { CONFIG } from '../config/invitationConfig';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** '2026-12-19' + '13:00' → Date 객체 (로컬 시간 기준) */
export function weddingDate() {
  const [y, m, d] = CONFIG.wedding.date.split('-').map(Number);
  const [hh, mm] = CONFIG.wedding.time.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

/** 2026년 12월 19일 토요일 */
export function formatFullDate() {
  const dt = weddingDate();
  return `${dt.getFullYear()}년 ${dt.getMonth() + 1}월 ${dt.getDate()}일 ${WEEKDAYS[dt.getDay()]}요일`;
}

/** 오후 1시 / 오후 1시 30분 */
export function formatTime() {
  const dt = weddingDate();
  const h = dt.getHours();
  const m = dt.getMinutes();
  const meridiem = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${meridiem} ${h12}시` : `${meridiem} ${h12}시 ${m}분`;
}

/** 토요일 */
export function formatWeekday() {
  return `${WEEKDAYS[weddingDate().getDay()]}요일`;
}

/** 2026.12.19 */
export function formatShortDate() {
  return CONFIG.wedding.date.replaceAll('-', '.');
}

/** 고인이면 이름 앞에 故 를 붙인다 */
export function withDeceased(name, deceased) {
  return deceased ? `故 ${name}` : name;
}
