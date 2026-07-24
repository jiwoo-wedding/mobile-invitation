import React from 'react';
// 내빈용 페이지 — 전체 섹션 렌더링 (장소 · 예식장 안내 · 계좌 · RSVP 포함)
import HeroSection from '../components/common/HeroSection';
import GreetingSection from '../components/common/GreetingSection';
import DdaySection from '../components/common/DdaySection';
import StorySection from '../components/common/StorySection';
import GallerySection from '../components/common/GallerySection';
import ContactSection from '../components/common/ContactSection';
import GuestbookSection from '../components/common/GuestbookSection';
import SectionDivider from '../components/common/SectionDivider';
import Footer from '../components/common/Footer';
import LocationSection from '../components/private/LocationSection';
import InfoSection from '../components/private/InfoSection';
import AccountSection from '../components/private/AccountSection';
import RsvpSection from '../components/private/RsvpSection';

export default function GuestPage({ view }) {
  return (
    <>
      <HeroSection />
      <SectionDivider />
      <GreetingSection view={view} />
      <SectionDivider />
      <DdaySection />
      <SectionDivider />
      <StorySection />
      <SectionDivider />
      <GallerySection />

      {view.showLocation && (
        <>
          <SectionDivider />
          <LocationSection />
        </>
      )}

      {view.showInfo && (
        <>
          <SectionDivider />
          <InfoSection />
        </>
      )}

      {view.showRsvp && (
        <>
          <SectionDivider />
          <RsvpSection />
        </>
      )}

      {view.showAccount && (
        <>
          <SectionDivider />
          <AccountSection />
        </>
      )}

      <SectionDivider />
      <ContactSection />
      <SectionDivider />
      <GuestbookSection />
      <Footer type={view.type} />
    </>
  );
}
