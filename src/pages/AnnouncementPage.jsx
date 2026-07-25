import React from 'react';
// 외부 알림용 페이지 — 장소 · 예식장 안내 · 계좌 · RSVP 를 렌더링하지 않는다.
// (조건부 숨김이 아니라 아예 import 하지 않아, 번들에 해당 코드가 섞이지 않는다)
import IntroSection from '../components/common/IntroSection';
import GreetingSection from '../components/common/GreetingSection';
import DdaySection from '../components/common/DdaySection';
import StorySection from '../components/common/StorySection';
import GallerySection from '../components/common/GallerySection';
import ContactSection from '../components/common/ContactSection';
import GuestbookSection from '../components/common/GuestbookSection';
import SectionStack from '../components/common/SectionStack';
import Reveal from '../components/common/Reveal';
import Footer from '../components/common/Footer';
import NoticeSection from '../components/public/NoticeSection';
import { isSupabaseReady } from '../lib/supabase';

export default function AnnouncementPage({ view }) {
  const sections = [
    <GreetingSection view={view} />,
    <DdaySection view={view} />,
    <StorySection />,
    <GallerySection />,
    view.showNotice && <NoticeSection />,
    <ContactSection />,
    isSupabaseReady && <GuestbookSection />,
  ];

  return (
    <>
      <IntroSection view={view} />
      <SectionStack sections={sections} />
      <Reveal>
        <Footer type={view.type} />
      </Reveal>
    </>
  );
}
