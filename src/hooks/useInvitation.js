import { useEffect, useState } from 'react';
import { CONFIG, INVITATION_CONFIG } from '../config/invitationConfig';
import { applyTheme } from '../config/themes';

/**
 * URL 쿼리 파라미터를 읽어 초대장 종류와 테마를 결정한다.
 *
 *   (파라미터 없음)   → announcement (외부 알림용, 장소·계좌·RSVP 숨김)
 *   ?type=guest       → guest (내빈용, 전체 노출)
 *   ?theme=luxury-gold → 테마 미리보기 (CONFIG.allowThemePreview 가 true 일 때만)
 */
export function useInvitation() {
  const [state, setState] = useState(() => ({
    type: 'announcement',
    view: INVITATION_CONFIG.announcement,
    themeId: CONFIG.theme,
  }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const type = params.get('type') === 'guest' ? 'guest' : 'announcement';

    const requested = params.get('theme');
    const themeId = CONFIG.allowThemePreview && requested ? requested : CONFIG.theme;

    const applied = applyTheme(themeId);
    setState({ type, view: INVITATION_CONFIG[type], themeId: applied.id });
  }, []);

  return state;
}
