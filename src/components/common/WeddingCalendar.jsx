import React from 'react';
import { weddingDate } from '../../lib/format';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 예식이 있는 달의 달력. 예식일 하나만 강조한다.
 *
 * 날짜만 보여주므로 외부 알림용에도 그대로 쓸 수 있다.
 * (예식 시간이나 장소는 노출하지 않는다)
 */
export default function WeddingCalendar() {
  const target = weddingDate();
  const year = target.getFullYear();
  const month = target.getMonth(); // 0 = 1월
  const weddingDay = target.getDate();

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

          const isWedding = day === weddingDay;
          const isSunday = i % 7 === 0;

          return (
            <div key={day} className="flex justify-center">
              <span
                aria-current={isWedding ? 'date' : undefined}
                className={
                  isWedding
                    ? 'grid size-7 place-items-center rounded-full bg-accent font-bold text-accent-fg'
                    : `grid size-7 place-items-center tabular-nums ${
                        isSunday ? 'text-muted/70' : 'text-ink/80'
                      }`
                }
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
