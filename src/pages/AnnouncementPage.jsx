import React from 'react';
// 외부 알림용 페이지 — 장소 · 예식장 안내 · 계좌 · RSVP 를 렌더링하지 않는다.
// (조건부 숨김이 아니라 아예 import 하지 않아, 번들에서 계좌번호가 노출될 여지를 줄인다.)
import IntroSection from '../components/common/IntroSection';
import GreetingSection from '../components/common/GreetingSection';
import DdaySection from '../components/common/DdaySection';
import StorySection from '../components/common/StorySection';
import GallerySection from '../components/common/GallerySection';
import ContactSection from '../components/common/ContactSection';
import GuestbookSection from '../components/common/GuestbookSection';
import SectionDivider from '../components/common/SectionDivider';
import Reveal from '../components/common/Reveal';
import Footer from '../components/common/Footer';
import NoticeSection from '../components/public/NoticeSection';

export default function AnnouncementPage({ view }) {
  return (
    <>
      <IntroSection />

      <SectionDivider />
      <Reveal>
        <GreetingSection view={view} />
      </Reveal>

      <SectionDivider />
      <Reveal>
        <DdaySection />
      </Reveal>

      <SectionDivider />
      <Reveal>
        <StorySection />
      </Reveal>

      <SectionDivider />
      <Reveal>
        <GallerySection />
      </Reveal>

      <SectionDivider />
      <Reveal>
        <NoticeSection />
      </Reveal>

      <SectionDivider />
      <Reveal>
        <ContactSection />
      </Reveal>

      <SectionDivider />
      <Reveal>
        <GuestbookSection />
      </Reveal>

      <Reveal>
        <Footer type={view.type} />
      </Reveal>
    </>
  );
}
