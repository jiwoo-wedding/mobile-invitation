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

export default function DdaySection({ view }) {
  const target = weddingDate();
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    // 1초마다 실제 현재 시각과 비교해 다시 계산한다.
    // (직접 빼는 방식이 아니라 매번 Date.now() 로 재계산하므로
    //  탭이 백그라운드로 갔다 와도, 자정을 넘겨도 값이 정확하다.)
    const timer = setInterval(() => {
      setRemaining(getRemaining(target));
    }, 60000);

    return () => clearInterval(timer); // 언마운트 시 정리
  }, [CONFIG.wedding.date, CONFIG.wedding.time]);

  const { groom, bride } = CONFIG.couple;
  // 외부 알림용은 남은 날짜만, 내빈용은 시·분·초까지 보여준다

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
          : `${groom.name} ♥ ${bride.name}의 결혼식이 ${remaining.days}일 남았습니다.`}
      </p>
    </section>
  );
}
