-- 모바일 청첩장 초기 스키마
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.

-- ── 1. 참석 여부 (RSVP) ──────────────────────────
create table if not exists public.rsvp_submissions (
  id          bigint generated always as identity primary key,
  side        text        not null check (side in ('groom', 'bride')),
  name        text        not null check (char_length(name) between 1 and 20),
  attending   boolean     not null,
  headcount   smallint    not null default 1 check (headcount between 1 and 20),
  meal        boolean     not null default true,
  note        text        check (note is null or char_length(note) <= 200),
  created_at  timestamptz not null default now()
);

-- ── 2. 방명록 ────────────────────────────────────
create table if not exists public.guestbook_messages (
  id          bigint generated always as identity primary key,
  name        text        not null check (char_length(name) between 1 and 20),
  message     text        not null check (char_length(message) between 1 and 300),
  created_at  timestamptz not null default now()
);

create index if not exists guestbook_messages_created_at_idx
  on public.guestbook_messages (created_at desc);

-- ── 3. RLS ──────────────────────────────────────
-- anon 키는 브라우저에 그대로 노출되므로, 반드시 최소 권한만 열어둔다.
alter table public.rsvp_submissions   enable row level security;
alter table public.guestbook_messages enable row level security;

-- RSVP: 누구나 제출은 가능하되, 조회는 불가능하다.
-- (하객 명단은 Supabase 대시보드에서만 확인)
drop policy if exists "rsvp insert for anyone" on public.rsvp_submissions;
create policy "rsvp insert for anyone"
  on public.rsvp_submissions for insert to anon, authenticated
  with check (true);

-- 방명록: 누구나 남길 수 있고, 누구나 읽을 수 있다.
drop policy if exists "guestbook insert for anyone" on public.guestbook_messages;
create policy "guestbook insert for anyone"
  on public.guestbook_messages for insert to anon, authenticated
  with check (true);

drop policy if exists "guestbook select for anyone" on public.guestbook_messages;
create policy "guestbook select for anyone"
  on public.guestbook_messages for select to anon, authenticated
  using (true);

-- 수정/삭제 정책은 만들지 않는다 → anon 키로는 위변조가 불가능하다.
