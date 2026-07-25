import React, { useState } from 'react';
import { useInvitation } from './hooks/useInvitation';
import { CONFIG } from './config/invitationConfig';
import CurtainCover from './components/common/CurtainCover';
import ThemeSwitcher from './components/common/ThemeSwitcher';
import GuestPage from './pages/GuestPage';
import AnnouncementPage from './pages/AnnouncementPage';

export default function App() {
  const { type, view, themeId, setTheme } = useInvitation();
  const [opened, setOpened] = useState(!CONFIG.useCurtain);

  // 테마를 고르는 동안에만 뜨는 도구. 정한 뒤에는 allowThemePreview 를 false 로.
  const switcher = CONFIG.allowThemePreview ? (
    <ThemeSwitcher current={themeId} onChange={setTheme} />
  ) : null;

  if (!opened) {
    return (
      <>
        <CurtainCover onOpen={() => setOpened(true)} />
        {switcher}
      </>
    );
  }

  return (
    <>
      <div className="mobile-container text-ink">
        {type === 'guest' ? <GuestPage view={view} /> : <AnnouncementPage view={view} />}
      </div>
      {switcher}
    </>
  );
}
