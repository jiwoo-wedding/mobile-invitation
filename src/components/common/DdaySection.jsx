import React, { useEffect, useState } from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { weddingDate, formatFullDate, formatTime } from '../../lib/format';
import SectionTitle from './SectionTitle';
import WeddingCalendar from './WeddingCalendar';
import { showsTime } from '../../lib/visibility';

/** 남은 시간을 {일, 시, 분, 초, 지남} 으로 계산 */
function getRemaining(target) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    passed: false,
  };
}

function daysUntilWedding() {
  const target = weddingDate();
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((targetMidnight - todayMidnight) / MS_PER_DAY);
}
/**
 * 오늘부터 예식일까지 며칠 남았는지. 시각은 무시하고 날짜만 센다.
 * getRemaining 은 예식 시각까지의 시간을 재기 때문에, 그 값으로 날짜를 세면
 * 하루가 안 되는 조각이 버려져 달력으로 세는 것보다 하루 적게 나온다.
 */

export default function DdaySection({ view }) {
  const target = weddingDate();
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    // 1분마다 현재 시각과 비교해 다시 계산한다.
    // 자정을 넘기면 남은 일수가, 예식 시각을 지나면 지난 예식 문구로 자동 갱신된다.
    const timer = setInterval(() => {
      setRemaining(getRemaining(target));
    }, 60000);

    return () => clearInterval(timer); // 언마운트 시 정리
  }, [CONFIG.wedding.date, CONFIG.wedding.time]);

  const { groom, bride } = CONFIG.couple;
  const daysLeft = daysUntilWedding();

  return (
    <section className="px-5 py-6">
      <SectionTitle
        label="D-DAY"
        sub={showsTime(view) ? `${formatFullDate()} ${formatTime()}` : formatFullDate()}
      />

      <WeddingCalendar />

      <p className="mt-5 text-center text-sm text-muted">
        {remaining.passed
          ? `${groom.name}, ${bride.name}의 결혼식이 있었습니다. 함께해 주셔서 감사합니다.`
          : daysLeft === 0
            ? `${groom.name} ♥ ${bride.name}의 결혼식이 오늘입니다.`
            : `${groom.name} ♥ ${bride.name}의 결혼식이 ${daysLeft}일 남았습니다.`}
      </p>
    </section>
  );
}
