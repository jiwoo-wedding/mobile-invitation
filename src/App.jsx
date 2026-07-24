import React, { useState } from 'react';
import { useInvitation } from './hooks/useInvitation';
import { CONFIG } from './config/invitationConfig';
import CurtainCover from './components/common/CurtainCover';
import GuestPage from './pages/GuestPage';
import AnnouncementPage from './pages/AnnouncementPage';

export default function App() {
  const { type, view } = useInvitation();
  const [opened, setOpened] = useState(!CONFIG.useCurtain);

  if (!opened) {
    return <CurtainCover onOpen={() => setOpened(true)} />;
  }

  return (
    <div className="mobile-container text-ink">
      {type === 'guest' ? <GuestPage view={view} /> : <AnnouncementPage view={view} />}
    </div>
  );
}
