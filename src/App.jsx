import React, { useState } from 'react';
import { CONFIG } from './config/invitationConfig';
import { useInvitation } from './hooks/useInvitation';
import CurtainCover from './components/common/CurtainCover';
import ThemeSwitcher from './components/common/ThemeSwitcher';
import GuestPage from './pages/GuestPage';
import AnnouncementPage from './pages/AnnouncementPage';

export default function App() {
  const { type, view, themeId, setTheme } = useInvitation();
  const [opened, setOpened] = useState(!CONFIG.useCurtain);

  // 종류에 따라 보여줄 페이지만 갈아끼운다. 테마와는 무관하게 동작한다.
  const Page = type === 'guest' ? GuestPage : AnnouncementPage;

  return (
    <>
      {opened ? (
        <div className="mobile-container text-ink">
          <Page view={view} />
        </div>
      ) : (
        <CurtainCover onOpen={() => setOpened(true)} view={view} />
      )}

      {/* 테마 고르는 동안만 노출. 정한 뒤 allowThemePreview 를 false 로 바꾸면 사라진다 */}
      {CONFIG.allowThemePreview && <ThemeSwitcher current={themeId} onChange={setTheme} />}
    </>
  );
}
