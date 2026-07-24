import React from 'react';
// 외부 알림용 페이지 — 장소 · 예식장 안내 · 계좌 · RSVP 를 렌더링하지 않는다.
// (조건부 숨김이 아니라 아예 import 하지 않아, 번들에서 계좌번호가 노출될 여지를 줄인다.)
import HeroSection from '../components/common/HeroSection';
import GreetingSection from '../components/common/GreetingSection';
import DdaySection from '../components/common/DdaySection';
import StorySection from '../components/common/StorySection';
import GallerySection from '../components/common/GallerySection';
import ContactSection from '../components/common/ContactSection';
import GuestbookSection from '../components/common/GuestbookSection';
import SectionDivider from '../components/common/SectionDivider';
import Footer from '../components/common/Footer';
import NoticeSection from '../components/public/NoticeSection';

export default function AnnouncementPage({ view }) {
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
      <SectionDivider />
      <NoticeSection />
      <SectionDivider />
      <ContactSection />
      <SectionDivider />
      <GuestbookSection />
      <Footer type={view.type} />
    </>
  );
}
