import React from 'react';
// 내빈용 페이지 — 전체 섹션 렌더링 (장소 · 예식장 안내 · 계좌 · RSVP 포함)
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
import LocationSection from '../components/private/LocationSection';
import InfoSection from '../components/private/InfoSection';
import AccountSection from '../components/private/AccountSection';
import RsvpSection from '../components/private/RsvpSection';

export default function GuestPage({ view }) {
  return (
    <>
      <IntroSection view={view} />

      <SectionDivider />
      <Reveal>
        <GreetingSection view={view} />
      </Reveal>

      <SectionDivider />
      <Reveal>
        <DdaySection view={view} />
      </Reveal>

      <SectionDivider />
      <Reveal>
        <StorySection />
      </Reveal>

      <SectionDivider />
      <Reveal>
        <GallerySection />
      </Reveal>

      {view.showLocation && (
        <>
          <SectionDivider />
          <Reveal>
            <LocationSection />
          </Reveal>
        </>
      )}

      {view.showInfo && (
        <>
          <SectionDivider />
          <Reveal>
            <InfoSection />
          </Reveal>
        </>
      )}

      {view.showRsvp && (
        <>
          <SectionDivider />
          <Reveal>
            <RsvpSection />
          </Reveal>
        </>
      )}

      {view.showAccount && (
        <>
          <SectionDivider />
          <Reveal>
            <AccountSection />
          </Reveal>
        </>
      )}

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
