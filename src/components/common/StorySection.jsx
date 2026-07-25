import React from 'react';
import { CONFIG } from '../../config/invitationConfig';
import { storyImages } from '../../lib/assets';
import SectionTitle from './SectionTitle';

/** 우리의 이야기 — CONFIG.story 가 비어 있으면 섹션 자체를 렌더링하지 않는다 */
export default function StorySection() {
  const stories = CONFIG.story ?? [];
  if (stories.length === 0) return null;

  return (
    <section className="px-5 py-6">
      <SectionTitle label="OUR STORY" sub="두 사람이 지나온 시간" />

      <div className="space-y-6">
        {stories.map((item, idx) => (
          <article key={item.title} className="overflow-hidden rounded-2xl border border-line/30">
            {storyImages[idx] && (
              <img
                src={storyImages[idx]}
                alt=""
                loading="lazy"
                className="h-56 w-full object-cover"
              />
            )}
            <div className="space-y-2 bg-surface/40 p-5 text-center">
              <h3 className="font-batang font-bold text-accent">{item.title}</h3>
              <p className="whitespace-pre-line text-sm leading-7 text-ink/90">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
