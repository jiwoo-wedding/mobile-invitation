import React from 'react';
import { weddingDate } from '../../lib/format';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/** 시각을 버리고 날짜만 남긴 값 (날짜끼리 비교하기 위해) */
const dateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/**
 * 예식이 있는 달의 달력.
 *
 *   예식일  : 악센트 색으로 채운 원
 *   오늘    : 테두리만 있는 원 (예식 달에 들어섰을 때만 나타난다)
 *   당일    : 채운 원 + 바깥 테두리
 *   지난 날 : 흐리게
 *
 * 날짜만 보여주므로 외부 알림용에도 그대로 쓸 수 있다.
 */
export default function WeddingCalendar() {
  const target = weddingDate();
  const year = target.getFullYear();
  const month = target.getMonth(); // 0 = 1월
  const weddingDay = target.getDate();

  const today = new Date();
  const todayStamp = dateOnly(today);

  // 오늘이 예식이 있는 달인지 (아니면 오늘 표시를 하지 않는다)
  const isWeddingMonth = today.getFullYear() === year && today.getMonth() === month;

  // 1일이 무슨 요일에서 시작하는지, 그 달이 며칠인지
  const startWeekday = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 앞쪽 빈 칸 + 날짜들
  const cells = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: lastDate }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl border border-line/30 bg-surface/40 px-4 py-5">
      <p className="mb-4 text-center font-batang text-sm tracking-widest text-accent">
        {year}. {String(month + 1).padStart(2, '0')}
      </p>

      <div className="grid grid-cols-7 gap-y-2 text-center text-[11px]">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`pb-1 font-bold ${i === 0 ? 'text-accent/70' : 'text-muted'}`}
          >
            {label}
          </div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} />;

          const stamp = dateOnly(new Date(year, month, day));
          const isWedding = day === weddingDay;
          const isToday = isWeddingMonth && stamp === todayStamp;
          const isPast = stamp < todayStamp;
          const isSunday = i % 7 === 0;

          // 겹칠 때는 채운 원을 우선하고, 오늘 표시는 바깥 테두리로 얹는다
          const shape = isWedding
            ? 'bg-accent font-bold text-accent-fg'
            : isToday
              ? 'border border-accent/70 font-bold text-accent'
              : isSunday
                ? 'text-muted/70'
                : 'text-ink/80';

          const dim = isPast && !isWedding && !isToday ? 'opacity-40' : '';
          const todayRing = isWedding && isToday ? 'ring-2 ring-accent/50 ring-offset-2 ring-offset-transparent' : '';

          return (
            <div key={day} className="flex justify-center">
              <span
                aria-label={
                  isToday
                    ? `${day}일, 오늘`
                    : isWedding
                      ? `${day}일, 예식일`
                      : undefined
                }
                aria-current={isToday ? 'date' : undefined}
                className={`grid size-7 place-items-center rounded-full tabular-nums ${shape} ${dim} ${todayRing}`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>

      {isWeddingMonth && (
        <p className="mt-4 flex items-center justify-center gap-3 text-[10px] text-muted">
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-accent" aria-hidden="true" />
            예식일
          </span>
          <span className="flex items-center gap-1">
            <span
              className="size-2.5 rounded-full border border-accent/70"
              aria-hidden="true"
            />
            오늘
          </span>
        </p>
      )}
    </div>
  );
}
