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
 * 지금은 양쪽 모두 남은 날짜(DAYS)만 보여준다.
 * 초 단위로 흘러가는 숫자는 시선을 끌지만 청첩장에서 꼭 필요한 정보는 아니다.
 *
 * 시·분·초를 다시 켜려면 invitationConfig.js 의 해당 종류에
 * showCountdownDetail: true 를 적으면 된다.
 */
export const showsCountdownDetail = (view) => view?.showCountdownDetail ?? false;
