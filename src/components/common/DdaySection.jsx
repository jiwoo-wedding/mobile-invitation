import React, { useEffect, useState } from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { weddingDate, formatFullDate, formatTime } from '../../lib/format';
import SectionTitle from './SectionTitle';

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

export default function DdaySection() {
  const target = weddingDate();
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    // 1초마다 실제 현재 시각과 비교해 다시 계산한다.
    // (직접 빼는 방식이 아니라 매번 Date.now() 로 재계산하므로
    //  탭이 백그라운드로 갔다 와도, 자정을 넘겨도 값이 정확하다.)
    const timer = setInterval(() => {
      setRemaining(getRemaining(target));
    }, 1000);

    return () => clearInterval(timer); // 언마운트 시 정리
  }, [CONFIG.wedding.date, CONFIG.wedding.time]);

  const { groom, bride } = CONFIG.couple;
  const units = [
    { label: 'DAYS', value: remaining.days },
    { label: 'HOUR', value: remaining.hours },
    { label: 'MIN', value: remaining.minutes },
    { label: 'SEC', value: remaining.seconds },
  ];

  return (
    <section className="px-5 py-6">
      <SectionTitle label="D-DAY" sub={`${formatFullDate()} ${formatTime()}`} />

      <div className="grid grid-cols-4 gap-2">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="rounded-xl border border-line/30 bg-surface/40 py-4 text-center"
          >
            <div className="font-batang text-2xl font-bold text-accent tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="mt-1 text-[10px] tracking-widest text-muted">{unit.label}</div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-sm text-muted">
        {remaining.passed
          ? `${groom.name}, ${bride.name}의 결혼식이 있었습니다. 함께해 주셔서 감사합니다.`
          : `${groom.name} ♥ ${bride.name}의 결혼식이 ${remaining.days}일 남았습니다.`}
      </p>
    </section>
  );
}
