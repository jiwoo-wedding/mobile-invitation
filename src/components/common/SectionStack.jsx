import React from 'react';
import SectionDivider from './SectionDivider';
import Reveal from './Reveal';

/**
 * 섹션들을 받아 사이사이에 구분선(✦ ✦ ✦)을 자동으로 끼운다.
 *
 * 구분선을 섹션마다 손으로 붙이면, 조건에 걸려 사라진 섹션의 구분선만 남아
 * ✦ ✦ ✦ 가 연속으로 보이는 문제가 생긴다.
 * (예: Supabase 미연결 시 RSVP 섹션이 비어 ACCOUNT 위에 두 줄이 겹침)
 *
 * 사용법 — false 나 null 을 그냥 섞어 넣으면 알아서 걸러진다.
 *   <SectionStack
 *     sections={[
 *       <GreetingSection view={view} />,
 *       view.showAccount && <AccountSection />,
 *     ]}
 *   />
 *
 * 주의: 화면에 아무것도 그리지 않는 컴포넌트(내부에서 null 을 반환하는 경우)는
 *       여기서 걸러낼 수 없다. 그런 섹션은 조건을 바깥으로 꺼내서 넘겨야 한다.
 */
export default function SectionStack({ sections, leading = true }) {
  const visible = sections.filter(Boolean);

  return (
    <>
      {visible.map((section, index) => (
        <React.Fragment key={index}>
          {(leading || index > 0) && <SectionDivider />}
          <Reveal>{section}</Reveal>
        </React.Fragment>
      ))}
    </>
  );
}
