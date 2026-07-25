import React from 'react';
// 내빈용 페이지 — 전체 섹션 렌더링 (장소 · 예식장 안내 · 계좌 · RSVP 포함)
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
import LocationSection from '../components/private/LocationSection';
import InfoSection from '../components/private/InfoSection';
import AccountSection from '../components/private/AccountSection';
import RsvpSection from '../components/private/RsvpSection';
import { isSupabaseReady } from '../lib/supabase';

export default function GuestPage({ view }) {
  // 조건에 걸려 빠진 섹션의 구분선이 남지 않도록 목록으로 넘긴다.
  // RSVP · 방명록은 Supabase 를 연결해야 화면에 나오므로 여기서 함께 판단한다.
  const sections = [
    <GreetingSection view={view} />,
    <DdaySection view={view} />,
    <StorySection />,
    <GallerySection />,
    view.showLocation && <LocationSection />,
    view.showInfo && <InfoSection />,
    view.showRsvp && isSupabaseReady && <RsvpSection />,
    view.showAccount && <AccountSection />,
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
