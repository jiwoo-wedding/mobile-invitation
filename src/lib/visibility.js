/**
 * 링크 종류에 따라 무엇을 보여줄지 판단하는 공용 규칙.
 *
 * 외부 알림용은 손님을 초대하지 않는 링크다.
 * 그래서 "오시라"는 뜻으로 읽힐 정보(예식 시간, 예식장)를 보여주지 않고
 * 날짜만 알린다.
 *
 * invitationConfig.js 의 각 종류에 showTime / showVenue 를 직접 적으면
 * 그 값이 아래 기본 규칙보다 우선한다.
 */

/** 예식 시간(오후 1시)을 보여줄지 */
export const showsTime = (view) => view?.showTime ?? view?.type !== 'announcement';

/** 예식장 이름을 보여줄지 */
export const showsVenue = (view) => view?.showVenue ?? view?.type !== 'announcement';

/**
 * D-DAY 를 시·분·초까지 보여줄지.
 *
 * 외부 알림용은 '며칠 남았다' 정도만 알리면 되고,
 * 초 단위 카운트다운은 오시라는 신호로 읽힐 수 있어 남은 날짜만 보여준다.
 */
export const showsCountdownDetail = (view) =>
  view?.showCountdownDetail ?? view?.type !== 'announcement';
