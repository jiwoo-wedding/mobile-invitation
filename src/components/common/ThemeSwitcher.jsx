import React, { useState } from 'react';
import { Palette, Check, X } from 'lucide-react';
import { THEME_LIST } from '../../config/themes';

/**
 * 테마 미리보기 전환기 (CONFIG.allowThemePreview 가 true 일 때만 표시)
 *
 * 13개 테마를 실제 내용 위에 바로 입혀 비교할 수 있다.
 * 고른 테마는 주소창에도 반영되므로, 그 주소를 그대로 공유하면
 * 상대방도 같은 테마로 본다.
 * 테마를 정한 뒤에는 invitationConfig.js 의 allowThemePreview 를 false 로 바꿔
 * 이 버튼을 숨기세요.
 */
export default function ThemeSwitcher({ current, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="테마 바꾸기"
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 grid size-12 place-items-center rounded-full border border-line/50 bg-accent text-accent-fg shadow-lg transition-transform active:scale-90"
      >
        {open ? <X size={20} /> : <Palette size={20} />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 max-h-[70vh] w-64 overflow-y-auto rounded-2xl border border-line/40 bg-bg p-3 shadow-2xl">
          <p className="mb-2 px-1 text-[10px] tracking-[0.2em] text-muted">THEME</p>

          <ul className="space-y-1">
            {THEME_LIST.map((theme) => {
              const selected = theme.id === current;
              return (
                <li key={theme.id}>
                  <button
                    onClick={() => onChange(theme.id)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors ${
                      selected ? 'bg-accent/15' : 'hover:bg-accent/10'
                    }`}
                  >
                    {/* 배경 · 카드 · 악센트 세 색을 한 줄로 보여준다 */}
                    <span
                      aria-hidden="true"
                      className="flex h-4 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-black/20"
                    >
                      <span className="flex-1" style={{ background: theme.colors.bg }} />
                      <span className="flex-1" style={{ background: theme.colors.surface }} />
                      <span className="flex-1" style={{ background: theme.colors.accent }} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold">{theme.label}</span>
                      <span className="block truncate text-[10px] text-muted">
                        {theme.description}
                      </span>
                    </span>

                    {selected && <Check size={14} className="shrink-0 text-accent" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-2 border-t border-line/20 px-1 pt-2 text-[10px] leading-4 text-muted">
            정한 테마는 invitationConfig.js 의 theme 에 적고,
            allowThemePreview 를 false 로 바꾸면 이 버튼이 사라집니다.
          </p>
        </div>
      )}
    </>
  );
}
