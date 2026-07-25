<#
  외부 알림용에서 예식 시간 · 예식장 숨기기

  외부 알림용 (파라미터 없는 주소)
    첫 화면 상단   INVITATION  ->  WEDDING ANNOUNCEMENT
    첫 화면 버튼   초대장 열기  ->  소식 보기
    첫 화면 정보   2026년 12월 19일 토요일          (시간 · 예식장 없음)
    히어로 사진    2026년 12월 19일 토요일          (시간 없음)
    D-DAY 부제     2026년 12월 19일 토요일          (시간 없음)

  내빈용 (?type=guest) 은 시간과 예식장이 그대로 나옵니다.

  바뀌는 파일 7개:
    src\lib\visibility.js                        (새 파일) 노출 규칙 한곳 관리
    src\components\common\CurtainCover.jsx
    src\components\common\IntroSection.jsx
    src\components\common\DdaySection.jsx
    src\pages\GuestPage.jsx                      링크 종류 전달
    src\pages\AnnouncementPage.jsx                링크 종류 전달
    src\App.jsx                                   링크 종류 전달

  ⚠️ invitationConfig.js 는 건드리지 않습니다.

  두는 곳: C:\Users\sb622\OneDrive\문서\GitHub\mobile-invitation\apply-announcement-hide.ps1
  실행:
      cd "C:\Users\sb622\OneDrive\문서\GitHub\mobile-invitation"
      powershell -ExecutionPolicy Bypass -File .\apply-announcement-hide.ps1

  되돌리려면:
      git checkout -- src/components src/pages src/App.jsx
      Remove-Item src\lib\visibility.js
#>

$ErrorActionPreference = 'Stop'

if (-not (Test-Path .\package.json)) {
  Write-Host '프로젝트 폴더에서 실행하세요 (package.json 이 있는 곳).' -ForegroundColor Red
  exit 1
}

function Write-ProjectFile {
  param([string]$Path, [string]$Base64)
  $dir = Split-Path -Parent $Path
  if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
  [IO.File]::WriteAllBytes(
    (Join-Path (Get-Location) $Path),
    [Convert]::FromBase64String($Base64)
  )
  Write-Host ('  덮어씀  ' + $Path)
}

Write-Host ''

Write-ProjectFile -Path 'src\lib\visibility.js' -Base64 (
  'LyoqCiAqIOunge2BrCDsooXrpZjsl5Ag65Sw6528IOustOyXh+ydhCDrs7Tsl6zspITsp4Ag7YyQ64uo7ZWY64qUIOqzteyaqSDqt5zsuZkuCiAqCiAqIOyZ' +
  'uOu2gCDslYzrprzsmqnsnYAg7IaQ64uY7J2EIOy0iOuMgO2VmOyngCDslYrripQg66eB7YGs64ukLgogKiDqt7jrnpjshJwgIuyYpOyLnOudvCLripQg65y7' +
  '7Jy866GcIOydve2ekCDsoJXrs7Qo7JiI7IudIOyLnOqwhCwg7JiI7Iud7J6lKeulvCDrs7Tsl6zso7zsp4Ag7JWK6rOgCiAqIOuCoOynnOunjCDslYzrprDr' +
  'i6QuCiAqCiAqIGludml0YXRpb25Db25maWcuanMg7J2YIOqwgSDsooXrpZjsl5Agc2hvd1RpbWUgLyBzaG93VmVudWUg66W8IOyngeygkSDsoIHsnLzrqbQK' +
  'ICog6re4IOqwkuydtCDslYTrnpgg6riw67O4IOq3nOy5meuztOuLpCDsmrDshKDtlZzri6QuCiAqLwoKLyoqIOyYiOyLnSDsi5zqsIQo7Jik7ZuEIDHsi5wp' +
  '7J2EIOuztOyXrOykhOyngCAqLwpleHBvcnQgY29uc3Qgc2hvd3NUaW1lID0gKHZpZXcpID0+IHZpZXc/LnNob3dUaW1lID8/IHZpZXc/LnR5cGUgIT09ICdh' +
  'bm5vdW5jZW1lbnQnOwoKLyoqIOyYiOyLneyepSDsnbTrpoTsnYQg67O07Jes7KSE7KeAICovCmV4cG9ydCBjb25zdCBzaG93c1ZlbnVlID0gKHZpZXcpID0+' +
  'IHZpZXc/LnNob3dWZW51ZSA/PyB2aWV3Py50eXBlICE9PSAnYW5ub3VuY2VtZW50JzsK'
)

Write-ProjectFile -Path 'src\components\common\CurtainCover.jsx' -Base64 (
  'aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JzsKaW1wb3J0IHsgQ09ORklHIH0gZnJvbSAnLi4vLi4vY29uZmlnL2ludml0YXRpb25Db25maWcnOwppbXBvcnQg' +
  'eyBmb3JtYXRGdWxsRGF0ZSwgZm9ybWF0VGltZSwgZm9ybWF0U2hvcnREYXRlIH0gZnJvbSAnLi4vLi4vbGliL2Zvcm1hdCc7CmltcG9ydCB7IHNob3dzVGlt' +
  'ZSwgc2hvd3NWZW51ZSB9IGZyb20gJy4uLy4uL2xpYi92aXNpYmlsaXR5JzsKCi8qKgogKiDssqsg7ZmU66m0IChDT05GSUcudXNlQ3VydGFpbiDsnbQgdHJ1' +
  'ZSDsnbwg65WM66eMIO2RnOyLnCkKICoKICogNDgwcHgg7Luo7YWM7J2064SI7JeQIOqwh+2eiOyngCDslYrqs6Ag7ZmU66m0IOyghOyytOulvCDssYTsmrTr' +
  'i6QuCiAqIOyCrOynhCDsl4bsnbQsIOyyreyyqeyepSDsubTrk5zsspjrn7wg7J207KSRIO2FjOuRkOumrOyZgCDquIDsnpDrp4zsnLzroZwg6rWs7ISx7ZaI' +
  '64ukLgogKgogKiDrp4Htgawg7KKF66WY7JeQIOuUsOudvCDshLHqsqnsnbQg64uk66W066+A66GcIOusuOq1rOyZgCDrhbjstpwg7KCV67O066W8IOuCmOuI' +
  'iOuLpC4KICogICDrgrTruYjsmqkgOiDstIjrjIDtlZjripQg7J6Q66asIOKGkiAnSU5WSVRBVElPTicgLyAn7LSI64yA7J6lIOyXtOq4sCcgLyDrgqDsp5wg' +
  'KyDsi5zqsIQgKyDsmIjsi53snqUKICogICDsmbjrtoDsmqkgOiDslYzrpqzripQg7IaM7IudICAg4oaSICdXRURESU5HIEFOTk9VTkNFTUVOVCcgLyAn7IaM' +
  '7IudIOuztOq4sCcgLyDrgqDsp5zrp4wKICoKICog7Jm467aAIOyGkOuLmOydgCDstIjrjIDtlZjsp4Ag7JWK7Jy866+A66GcLCDsmbjrtoDsmqnsl5DshJzr' +
  'ipQg7Iuc6rCE6rO8IOyYiOyLneyepeydhCDtkZzsi5ztlZjsp4Ag7JWK64qU64ukLgogKiAo7Jik7Iuc652864qUIOucu+ycvOuhnCDsnb3tnpAg7KCV67O0' +
  '66W8IOuCqOq4sOyngCDslYrripTri6QpCiAqICjrrLjqtazrpbwg67CU6r646rOgIOyLtuycvOuptCBpbnZpdGF0aW9uQ29uZmlnLmpzIOydmCDqsIEg7KKF' +
  '66WY7JeQCiAqICBjdXJ0YWluTGFiZWwgLyBjdXJ0YWluQnV0dG9uIOydhCDstpTqsIDtlZjrqbQg6re4IOqwkuydtCDsmrDshKDtlZzri6QpCiAqLwpjb25z' +
  'dCBDVVJUQUlOX1RFWFQgPSB7CiAgZ3Vlc3Q6IHsgbGFiZWw6ICdJTlZJVEFUSU9OJywgYnV0dG9uOiAn7LSI64yA7J6lIOyXtOq4sCcgfSwKICBhbm5vdW5j' +
  'ZW1lbnQ6IHsgbGFiZWw6ICdXRURESU5HIEFOTk9VTkNFTUVOVCcsIGJ1dHRvbjogJ+yGjOyLnSDrs7TquLAnIH0sCn07CgpleHBvcnQgZGVmYXVsdCBmdW5j' +
  'dGlvbiBDdXJ0YWluQ292ZXIoeyBvbk9wZW4sIHZpZXcgfSkgewogIGNvbnN0IHsgZ3Jvb20sIGJyaWRlIH0gPSBDT05GSUcuY291cGxlOwogIGNvbnN0IHsg' +
  'dmVudWUsIGhhbGwgfSA9IENPTkZJRy53ZWRkaW5nOwoKICBjb25zdCBwcmVzZXQgPSBDVVJUQUlOX1RFWFRbdmlldz8udHlwZV0gPz8gQ1VSVEFJTl9URVhU' +
  'LmFubm91bmNlbWVudDsKICBjb25zdCBsYWJlbCA9IHZpZXc/LmN1cnRhaW5MYWJlbCA/PyBwcmVzZXQubGFiZWw7CiAgY29uc3QgYnV0dG9uVGV4dCA9IHZp' +
  'ZXc/LmN1cnRhaW5CdXR0b24gPz8gcHJlc2V0LmJ1dHRvbjsKCiAgcmV0dXJuICgKICAgIDxkaXYgY2xhc3NOYW1lPSJjb3Zlci1zY3JlZW4gZml4ZWQgaW5z' +
  'ZXQtMCB6LTQwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG92ZXJmbG93LWhpZGRlbiBiZy1iZyBweC02IHRleHQtaW5rIj4KICAgICAgey8q' +
  'IOyyreyyqeyepSDsubTrk5wg64qQ64KM7J2YIOydtOykkSDthYzrkZDrpqwgKi99CiAgICAgIDxkaXYgY2xhc3NOYW1lPSJjb3Zlci1mcmFtZSBwb2ludGVy' +
  'LWV2ZW50cy1ub25lIGFic29sdXRlIGluc2V0LTQgYm9yZGVyIGJvcmRlci1saW5lLzI1IHNtOmluc2V0LTgiIC8+CiAgICAgIDxkaXYKICAgICAgICBjbGFz' +
  'c05hbWU9ImNvdmVyLWZyYW1lIHBvaW50ZXItZXZlbnRzLW5vbmUgYWJzb2x1dGUgaW5zZXQtWzIycHhdIGJvcmRlciBib3JkZXItbGluZS8xMiBzbTppbnNl' +
  'dC1bMzhweF0iCiAgICAgICAgc3R5bGU9e3sgYW5pbWF0aW9uRGVsYXk6ICcxNDBtcycgfX0KICAgICAgLz4KCiAgICAgIDxkaXYgY2xhc3NOYW1lPSJyZWxh' +
  'dGl2ZSBmbGV4IHctZnVsbCBtYXgtdy1zbSBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgZ2FwLTEyIHRleHQtY2VudGVyIj4KICAgICAgICA8cCBjbGFzc05hbWU9' +
  'ImFuaW1hdGUtZW50ZXIgZm9udC1iYXRhbmcgdGV4dC1bMTBweF0gdHJhY2tpbmctWzAuNTVlbV0gdGV4dC1hY2NlbnQiPgogICAgICAgICAge2xhYmVsfQog' +
  'ICAgICAgIDwvcD4KCiAgICAgICAgPGRpdiBjbGFzc05hbWU9ImFuaW1hdGUtZW50ZXIgc3BhY2UteS01IiBzdHlsZT17eyBhbmltYXRpb25EZWxheTogJzI1' +
  'MG1zJyB9fT4KICAgICAgICAgIDxoMSBjbGFzc05hbWU9ImZvbnQtYmF0YW5nIHRleHQtWzIuNnJlbV0gZm9udC1ib2xkIGxlYWRpbmctbm9uZSI+e2dyb29t' +
  'Lm5hbWV9PC9oMT4KCiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0iZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTMiPgogICAgICAgICAg' +
  'ICA8c3BhbiBjbGFzc05hbWU9ImgtcHggdy04IGJnLWxpbmUvNDAiIGFyaWEtaGlkZGVuPSJ0cnVlIiAvPgogICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9' +
  'ImZvbnQtYmF0YW5nIHRleHQteHMgdGV4dC1hY2NlbnQiPuq3uOumrOqzoDwvc3Bhbj4KICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSJoLXB4IHctOCBi' +
  'Zy1saW5lLzQwIiBhcmlhLWhpZGRlbj0idHJ1ZSIgLz4KICAgICAgICAgIDwvZGl2PgoKICAgICAgICAgIDxoMSBjbGFzc05hbWU9ImZvbnQtYmF0YW5nIHRl' +
  'eHQtWzIuNnJlbV0gZm9udC1ib2xkIGxlYWRpbmctbm9uZSI+e2JyaWRlLm5hbWV9PC9oMT4KICAgICAgICA8L2Rpdj4KCiAgICAgICAgPGRpdiBjbGFzc05h' +
  'bWU9ImFuaW1hdGUtZW50ZXIgc3BhY2UteS0yIiBzdHlsZT17eyBhbmltYXRpb25EZWxheTogJzQ1MG1zJyB9fT4KICAgICAgICAgIDxwIGNsYXNzTmFtZT0i' +
  'Zm9udC1iYXRhbmcgdGV4dC1iYXNlIHRyYWNraW5nLVswLjJlbV0gdGV4dC1hY2NlbnQgdGFidWxhci1udW1zIj4KICAgICAgICAgICAge2Zvcm1hdFNob3J0' +
  'RGF0ZSgpfQogICAgICAgICAgPC9wPgogICAgICAgICAgPHAgY2xhc3NOYW1lPSJ0ZXh0LXhzIGxlYWRpbmctNiB0ZXh0LW11dGVkIj4KICAgICAgICAgICAg' +
  'e2Zvcm1hdEZ1bGxEYXRlKCl9CiAgICAgICAgICAgIHtzaG93c1RpbWUodmlldykgJiYgYCAke2Zvcm1hdFRpbWUoKX1gfQogICAgICAgICAgICB7c2hvd3NW' +
  'ZW51ZSh2aWV3KSAmJiAoCiAgICAgICAgICAgICAgPD4KICAgICAgICAgICAgICAgIDxiciAvPgogICAgICAgICAgICAgICAge3ZlbnVlfSB7aGFsbH0KICAg' +
  'ICAgICAgICAgICA8Lz4KICAgICAgICAgICAgKX0KICAgICAgICAgIDwvcD4KICAgICAgICA8L2Rpdj4KCiAgICAgICAgPGJ1dHRvbgogICAgICAgICAgb25D' +
  'bGljaz17b25PcGVufQogICAgICAgICAgY2xhc3NOYW1lPSJhbmltYXRlLWVudGVyIHJvdW5kZWQtZnVsbCBib3JkZXIgYm9yZGVyLWxpbmUgYmctYWNjZW50' +
  'IHB4LTkgcHktMy41IHRleHQtc20gZm9udC1ib2xkIHRyYWNraW5nLXdpZGUgdGV4dC1hY2NlbnQtZmcgc2hhZG93LWxnIHRyYW5zaXRpb24tdHJhbnNmb3Jt' +
  'IGFjdGl2ZTpzY2FsZS05NSIKICAgICAgICAgIHN0eWxlPXt7IGFuaW1hdGlvbkRlbGF5OiAnNjUwbXMnIH19CiAgICAgICAgPgogICAgICAgICAge2J1dHRv' +
  'blRleHR9CiAgICAgICAgPC9idXR0b24+CiAgICAgIDwvZGl2PgogICAgPC9kaXY+CiAgKTsKfQo='
)

Write-ProjectFile -Path 'src\components\common\IntroSection.jsx' -Base64 (
  'aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JzsKaW1wb3J0IHsgQ09ORklHIH0gZnJvbSAnLi4vLi4vY29uZmlnL2ludml0YXRpb25Db25maWcnOwppbXBvcnQg' +
  'eyBtYWluSW1hZ2UgfSBmcm9tICcuLi8uLi9saWIvYXNzZXRzJzsKaW1wb3J0IHsgZm9ybWF0RnVsbERhdGUsIGZvcm1hdFRpbWUgfSBmcm9tICcuLi8uLi9s' +
  'aWIvZm9ybWF0JzsKaW1wb3J0IHsgc2hvd3NUaW1lIH0gZnJvbSAnLi4vLi4vbGliL3Zpc2liaWxpdHknOwoKLyoqCiAqIOyyqyDtmZTrqbQg4oCUIOuMgO2R' +
  'nCDsgqzsp4Qg7JyE7JeQIOydtOumhOqzvCDrgqDsp5zrpbwg7Jis66aw64ukLgogKiDsmbjrtoAg7JWM66a87Jqp7JeQ7ISc64qUIOyYiOyLnSDsi5zqsITs' +
  'nYQg67m86rOgIOuCoOynnOunjCDrs7Tsl6zspIDri6QuCiAqLwpleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbnRyb1NlY3Rpb24oeyB2aWV3IH0pIHsKICBj' +
  'b25zdCB7IGdyb29tLCBicmlkZSB9ID0gQ09ORklHLmNvdXBsZTsKCiAgcmV0dXJuICgKICAgIDxzZWN0aW9uIGNsYXNzTmFtZT0icmVsYXRpdmUgZmxleCBo' +
  'LXNjcmVlbiB3LWZ1bGwgZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBvdmVyZmxvdy1oaWRkZW4gdGV4dC1jZW50ZXIiPgogICAgICB7' +
  'bWFpbkltYWdlICYmICgKICAgICAgICA8aW1nCiAgICAgICAgICBzcmM9e21haW5JbWFnZX0KICAgICAgICAgIGFsdD0i7Iug656RIOyLoOu2gCDrjIDtkZwg' +
  '7IKs7KeEIgogICAgICAgICAgY2xhc3NOYW1lPSJhbmltYXRlLWtlbi1idXJucyBhYnNvbHV0ZSBpbnNldC0wIHotMCBoLWZ1bGwgdy1mdWxsIG9iamVjdC1j' +
  'b3ZlciIKICAgICAgICAgIHN0eWxlPXt7IG9iamVjdFBvc2l0aW9uOiBDT05GSUcubWFpblBob3RvUG9zaXRpb24gPz8gJzUwJSA1MCUnIH19CiAgICAgICAg' +
  'Lz4KICAgICAgKX0KICAgICAgey8qIOyVhOuemOyqveydhCDrs7jrrLgg67Cw6rK97IOJ7Jy866GcIOyekOyXsOyKpOufveqyjCDsnofripQg6re46528642w' +
  '7J207IWYICovfQogICAgICA8ZGl2IGNsYXNzTmFtZT0iYWJzb2x1dGUgaW5zZXQtMCB6LTEwIGJnLWdyYWRpZW50LXRvLWIgZnJvbS1ibGFjay80MCB2aWEt' +
  'dHJhbnNwYXJlbnQgdG8tYmciIC8+CgogICAgICA8ZGl2IGNsYXNzTmFtZT0icmVsYXRpdmUgei0yMCBzcGFjZS15LTIgcHQtMTYgZm9udC1iYXRhbmciPgog' +
  'ICAgICAgIDxwCiAgICAgICAgICBjbGFzc05hbWU9ImFuaW1hdGUtZW50ZXIgdGV4dC1zbSB0cmFja2luZy1bMC4zZW1dIHRleHQtYWNjZW50IgogICAgICAg' +
  'ICAgc3R5bGU9e3sgYW5pbWF0aW9uRGVsYXk6ICcyMDBtcycgfX0KICAgICAgICA+CiAgICAgICAgICBXRSBBUkUgR0VUVElORyBNQVJSSUVECiAgICAgICAg' +
  'PC9wPgogICAgICAgIDxoMSBjbGFzc05hbWU9ImFuaW1hdGUtZW50ZXIgdGV4dC0zeGwgZm9udC1ib2xkIiBzdHlsZT17eyBhbmltYXRpb25EZWxheTogJzQ1' +
  'MG1zJyB9fT4KICAgICAgICAgIHtncm9vbS5uYW1lfSA8c3BhbiBjbGFzc05hbWU9InRleHQtYWNjZW50Ij4mYW1wOzwvc3Bhbj4ge2JyaWRlLm5hbWV9CiAg' +
  'ICAgICAgPC9oMT4KICAgICAgICA8cCBjbGFzc05hbWU9ImFuaW1hdGUtZW50ZXIgdGV4dC1zbSBvcGFjaXR5LTkwIiBzdHlsZT17eyBhbmltYXRpb25EZWxh' +
  'eTogJzcwMG1zJyB9fT4KICAgICAgICAgIHtmb3JtYXRGdWxsRGF0ZSgpfQogICAgICAgICAge3Nob3dzVGltZSh2aWV3KSAmJiBgICR7Zm9ybWF0VGltZSgp' +
  'fWB9CiAgICAgICAgPC9wPgogICAgICA8L2Rpdj4KCiAgICAgIDxkaXYgY2xhc3NOYW1lPSJyZWxhdGl2ZSB6LTIwIGZsZXggYW5pbWF0ZS1ib3VuY2Utc2xv' +
  'dyBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgcGItOCI+CiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSJtYi0xIHRleHQteHMgdHJhY2tpbmctd2lkZXN0IHRleHQt' +
  'YWNjZW50Ij5TQ1JPTEwgRE9XTjwvc3Bhbj4KICAgICAgICA8ZGl2IGNsYXNzTmFtZT0iZmxleCBoLTggdy01IGp1c3RpZnktY2VudGVyIHJvdW5kZWQtZnVs' +
  'bCBib3JkZXItMiBib3JkZXItbGluZSBwdC0xIj4KICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSJoLTIgdy0xIHJvdW5kZWQtZnVsbCBiZy1hY2NlbnQiIC8+' +
  'CiAgICAgICAgPC9kaXY+CiAgICAgIDwvZGl2PgogICAgPC9zZWN0aW9uPgogICk7Cn0K'
)

Write-ProjectFile -Path 'src\components\common\DdaySection.jsx' -Base64 (
  'aW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7CmltcG9ydCB7IENPTkZJRyB9IGZyb20gJy4uLy4uL2NvbmZpZy9p' +
  'bnZpdGF0aW9uQ29uZmlnJzsKaW1wb3J0IHsgd2VkZGluZ0RhdGUsIGZvcm1hdEZ1bGxEYXRlLCBmb3JtYXRUaW1lIH0gZnJvbSAnLi4vLi4vbGliL2Zvcm1h' +
  'dCc7CmltcG9ydCBTZWN0aW9uVGl0bGUgZnJvbSAnLi9TZWN0aW9uVGl0bGUnOwppbXBvcnQgeyBzaG93c1RpbWUgfSBmcm9tICcuLi8uLi9saWIvdmlzaWJp' +
  'bGl0eSc7CgovKiog64Ko7J2AIOyLnOqwhOydhCB77J28LCDsi5wsIOu2hCwg7LSILCDsp4Drgqh9IOycvOuhnCDqs4TsgrAgKi8KZnVuY3Rpb24gZ2V0UmVt' +
  'YWluaW5nKHRhcmdldCkgewogIGNvbnN0IGRpZmYgPSB0YXJnZXQuZ2V0VGltZSgpIC0gRGF0ZS5ub3coKTsKICBpZiAoZGlmZiA8PSAwKSB7CiAgICByZXR1' +
  'cm4geyBkYXlzOiAwLCBob3VyczogMCwgbWludXRlczogMCwgc2Vjb25kczogMCwgcGFzc2VkOiB0cnVlIH07CiAgfQogIGNvbnN0IHRvdGFsU2Vjb25kcyA9' +
  'IE1hdGguZmxvb3IoZGlmZiAvIDEwMDApOwogIHJldHVybiB7CiAgICBkYXlzOiBNYXRoLmZsb29yKHRvdGFsU2Vjb25kcyAvIDg2NDAwKSwKICAgIGhvdXJz' +
  'OiBNYXRoLmZsb29yKCh0b3RhbFNlY29uZHMgJSA4NjQwMCkgLyAzNjAwKSwKICAgIG1pbnV0ZXM6IE1hdGguZmxvb3IoKHRvdGFsU2Vjb25kcyAlIDM2MDAp' +
  'IC8gNjApLAogICAgc2Vjb25kczogdG90YWxTZWNvbmRzICUgNjAsCiAgICBwYXNzZWQ6IGZhbHNlLAogIH07Cn0KCmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9u' +
  'IERkYXlTZWN0aW9uKHsgdmlldyB9KSB7CiAgY29uc3QgdGFyZ2V0ID0gd2VkZGluZ0RhdGUoKTsKICBjb25zdCBbcmVtYWluaW5nLCBzZXRSZW1haW5pbmdd' +
  'ID0gdXNlU3RhdGUoKCkgPT4gZ2V0UmVtYWluaW5nKHRhcmdldCkpOwoKICB1c2VFZmZlY3QoKCkgPT4gewogICAgLy8gMey0iOuniOuLpCDsi6TsoJwg7ZiE' +
  '7J6sIOyLnOqwgeqzvCDruYTqtZDtlbQg64uk7IucIOqzhOyCsO2VnOuLpC4KICAgIC8vICjsp4HsoJEg67m864qUIOuwqeyLneydtCDslYTri4jrnbwg66ek' +
  '67KIIERhdGUubm93KCkg66GcIOyerOqzhOyCsO2VmOuvgOuhnAogICAgLy8gIO2DreydtCDrsLHqt7jrnbzsmrTrk5zroZwg6rCU64ukIOyZgOuPhCwg7J6Q' +
  '7KCV7J2EIOuEmOqyqOuPhCDqsJLsnbQg7KCV7ZmV7ZWY64ukLikKICAgIGNvbnN0IHRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4gewogICAgICBzZXRSZW1h' +
  'aW5pbmcoZ2V0UmVtYWluaW5nKHRhcmdldCkpOwogICAgfSwgMTAwMCk7CgogICAgcmV0dXJuICgpID0+IGNsZWFySW50ZXJ2YWwodGltZXIpOyAvLyDslrjr' +
  'p4jsmrTtirgg7IucIOygleumrAogIH0sIFtDT05GSUcud2VkZGluZy5kYXRlLCBDT05GSUcud2VkZGluZy50aW1lXSk7CgogIGNvbnN0IHsgZ3Jvb20sIGJy' +
  'aWRlIH0gPSBDT05GSUcuY291cGxlOwogIGNvbnN0IHVuaXRzID0gWwogICAgeyBsYWJlbDogJ0RBWVMnLCB2YWx1ZTogcmVtYWluaW5nLmRheXMgfSwKICAg' +
  'IHsgbGFiZWw6ICdIT1VSJywgdmFsdWU6IHJlbWFpbmluZy5ob3VycyB9LAogICAgeyBsYWJlbDogJ01JTicsIHZhbHVlOiByZW1haW5pbmcubWludXRlcyB9' +
  'LAogICAgeyBsYWJlbDogJ1NFQycsIHZhbHVlOiByZW1haW5pbmcuc2Vjb25kcyB9LAogIF07CgogIHJldHVybiAoCiAgICA8c2VjdGlvbiBjbGFzc05hbWU9' +
  'InB4LTUgcHktNiI+CiAgICAgIDxTZWN0aW9uVGl0bGUKICAgICAgICBsYWJlbD0iRC1EQVkiCiAgICAgICAgc3ViPXtzaG93c1RpbWUodmlldykgPyBgJHtm' +
  'b3JtYXRGdWxsRGF0ZSgpfSAke2Zvcm1hdFRpbWUoKX1gIDogZm9ybWF0RnVsbERhdGUoKX0KICAgICAgLz4KCiAgICAgIDxkaXYgY2xhc3NOYW1lPSJncmlk' +
  'IGdyaWQtY29scy00IGdhcC0yIj4KICAgICAgICB7dW5pdHMubWFwKCh1bml0KSA9PiAoCiAgICAgICAgICA8ZGl2CiAgICAgICAgICAgIGtleT17dW5pdC5s' +
  'YWJlbH0KICAgICAgICAgICAgY2xhc3NOYW1lPSJyb3VuZGVkLXhsIGJvcmRlciBib3JkZXItbGluZS8zMCBiZy1zdXJmYWNlLzQwIHB5LTQgdGV4dC1jZW50' +
  'ZXIiCiAgICAgICAgICA+CiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSJmb250LWJhdGFuZyB0ZXh0LTJ4bCBmb250LWJvbGQgdGV4dC1hY2NlbnQgdGFi' +
  'dWxhci1udW1zIj4KICAgICAgICAgICAgICB7U3RyaW5nKHVuaXQudmFsdWUpLnBhZFN0YXJ0KDIsICcwJyl9CiAgICAgICAgICAgIDwvZGl2PgogICAgICAg' +
  'ICAgICA8ZGl2IGNsYXNzTmFtZT0ibXQtMSB0ZXh0LVsxMHB4XSB0cmFja2luZy13aWRlc3QgdGV4dC1tdXRlZCI+e3VuaXQubGFiZWx9PC9kaXY+CiAgICAg' +
  'ICAgICA8L2Rpdj4KICAgICAgICApKX0KICAgICAgPC9kaXY+CgogICAgICA8cCBjbGFzc05hbWU9Im10LTQgdGV4dC1jZW50ZXIgdGV4dC1zbSB0ZXh0LW11' +
  'dGVkIj4KICAgICAgICB7cmVtYWluaW5nLnBhc3NlZAogICAgICAgICAgPyBgJHtncm9vbS5uYW1lfSwgJHticmlkZS5uYW1lfeydmCDqsrDtmLzsi53snbQg' +
  '7J6I7JeI7Iq164uI64ukLiDtlajqu5jtlbQg7KO87IWU7IScIOqwkOyCrO2VqeuLiOuLpC5gCiAgICAgICAgICA6IGAke2dyb29tLm5hbWV9IOKZpSAke2Jy' +
  'aWRlLm5hbWV97J2YIOqysO2YvOyLneydtCAke3JlbWFpbmluZy5kYXlzfeydvCDrgqjslZjsirXri4jri6QuYH0KICAgICAgPC9wPgogICAgPC9zZWN0aW9u' +
  'PgogICk7Cn0K'
)

Write-ProjectFile -Path 'src\pages\GuestPage.jsx' -Base64 (
  'aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JzsKLy8g64K067mI7JqpIO2OmOydtOyngCDigJQg7KCE7LK0IOyEueyFmCDroIzrjZTrp4EgKOyepeyGjCDCtyDs' +
  'mIjsi53snqUg7JWI64K0IMK3IOqzhOyijCDCtyBSU1ZQIO2PrO2VqCkKaW1wb3J0IEludHJvU2VjdGlvbiBmcm9tICcuLi9jb21wb25lbnRzL2NvbW1vbi9J' +
  'bnRyb1NlY3Rpb24nOwppbXBvcnQgR3JlZXRpbmdTZWN0aW9uIGZyb20gJy4uL2NvbXBvbmVudHMvY29tbW9uL0dyZWV0aW5nU2VjdGlvbic7CmltcG9ydCBE' +
  'ZGF5U2VjdGlvbiBmcm9tICcuLi9jb21wb25lbnRzL2NvbW1vbi9EZGF5U2VjdGlvbic7CmltcG9ydCBTdG9yeVNlY3Rpb24gZnJvbSAnLi4vY29tcG9uZW50' +
  'cy9jb21tb24vU3RvcnlTZWN0aW9uJzsKaW1wb3J0IEdhbGxlcnlTZWN0aW9uIGZyb20gJy4uL2NvbXBvbmVudHMvY29tbW9uL0dhbGxlcnlTZWN0aW9uJzsK' +
  'aW1wb3J0IENvbnRhY3RTZWN0aW9uIGZyb20gJy4uL2NvbXBvbmVudHMvY29tbW9uL0NvbnRhY3RTZWN0aW9uJzsKaW1wb3J0IEd1ZXN0Ym9va1NlY3Rpb24g' +
  'ZnJvbSAnLi4vY29tcG9uZW50cy9jb21tb24vR3Vlc3Rib29rU2VjdGlvbic7CmltcG9ydCBTZWN0aW9uRGl2aWRlciBmcm9tICcuLi9jb21wb25lbnRzL2Nv' +
  'bW1vbi9TZWN0aW9uRGl2aWRlcic7CmltcG9ydCBSZXZlYWwgZnJvbSAnLi4vY29tcG9uZW50cy9jb21tb24vUmV2ZWFsJzsKaW1wb3J0IEZvb3RlciBmcm9t' +
  'ICcuLi9jb21wb25lbnRzL2NvbW1vbi9Gb290ZXInOwppbXBvcnQgTG9jYXRpb25TZWN0aW9uIGZyb20gJy4uL2NvbXBvbmVudHMvcHJpdmF0ZS9Mb2NhdGlv' +
  'blNlY3Rpb24nOwppbXBvcnQgSW5mb1NlY3Rpb24gZnJvbSAnLi4vY29tcG9uZW50cy9wcml2YXRlL0luZm9TZWN0aW9uJzsKaW1wb3J0IEFjY291bnRTZWN0' +
  'aW9uIGZyb20gJy4uL2NvbXBvbmVudHMvcHJpdmF0ZS9BY2NvdW50U2VjdGlvbic7CmltcG9ydCBSc3ZwU2VjdGlvbiBmcm9tICcuLi9jb21wb25lbnRzL3By' +
  'aXZhdGUvUnN2cFNlY3Rpb24nOwoKZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR3Vlc3RQYWdlKHsgdmlldyB9KSB7CiAgcmV0dXJuICgKICAgIDw+CiAgICAg' +
  'IDxJbnRyb1NlY3Rpb24gdmlldz17dmlld30gLz4KCiAgICAgIDxTZWN0aW9uRGl2aWRlciAvPgogICAgICA8UmV2ZWFsPgogICAgICAgIDxHcmVldGluZ1Nl' +
  'Y3Rpb24gdmlldz17dmlld30gLz4KICAgICAgPC9SZXZlYWw+CgogICAgICA8U2VjdGlvbkRpdmlkZXIgLz4KICAgICAgPFJldmVhbD4KICAgICAgICA8RGRh' +
  'eVNlY3Rpb24gdmlldz17dmlld30gLz4KICAgICAgPC9SZXZlYWw+CgogICAgICA8U2VjdGlvbkRpdmlkZXIgLz4KICAgICAgPFJldmVhbD4KICAgICAgICA8' +
  'U3RvcnlTZWN0aW9uIC8+CiAgICAgIDwvUmV2ZWFsPgoKICAgICAgPFNlY3Rpb25EaXZpZGVyIC8+CiAgICAgIDxSZXZlYWw+CiAgICAgICAgPEdhbGxlcnlT' +
  'ZWN0aW9uIC8+CiAgICAgIDwvUmV2ZWFsPgoKICAgICAge3ZpZXcuc2hvd0xvY2F0aW9uICYmICgKICAgICAgICA8PgogICAgICAgICAgPFNlY3Rpb25EaXZp' +
  'ZGVyIC8+CiAgICAgICAgICA8UmV2ZWFsPgogICAgICAgICAgICA8TG9jYXRpb25TZWN0aW9uIC8+CiAgICAgICAgICA8L1JldmVhbD4KICAgICAgICA8Lz4K' +
  'ICAgICAgKX0KCiAgICAgIHt2aWV3LnNob3dJbmZvICYmICgKICAgICAgICA8PgogICAgICAgICAgPFNlY3Rpb25EaXZpZGVyIC8+CiAgICAgICAgICA8UmV2' +
  'ZWFsPgogICAgICAgICAgICA8SW5mb1NlY3Rpb24gLz4KICAgICAgICAgIDwvUmV2ZWFsPgogICAgICAgIDwvPgogICAgICApfQoKICAgICAge3ZpZXcuc2hv' +
  'd1JzdnAgJiYgKAogICAgICAgIDw+CiAgICAgICAgICA8U2VjdGlvbkRpdmlkZXIgLz4KICAgICAgICAgIDxSZXZlYWw+CiAgICAgICAgICAgIDxSc3ZwU2Vj' +
  'dGlvbiAvPgogICAgICAgICAgPC9SZXZlYWw+CiAgICAgICAgPC8+CiAgICAgICl9CgogICAgICB7dmlldy5zaG93QWNjb3VudCAmJiAoCiAgICAgICAgPD4K' +
  'ICAgICAgICAgIDxTZWN0aW9uRGl2aWRlciAvPgogICAgICAgICAgPFJldmVhbD4KICAgICAgICAgICAgPEFjY291bnRTZWN0aW9uIC8+CiAgICAgICAgICA8' +
  'L1JldmVhbD4KICAgICAgICA8Lz4KICAgICAgKX0KCiAgICAgIDxTZWN0aW9uRGl2aWRlciAvPgogICAgICA8UmV2ZWFsPgogICAgICAgIDxDb250YWN0U2Vj' +
  'dGlvbiAvPgogICAgICA8L1JldmVhbD4KCiAgICAgIDxTZWN0aW9uRGl2aWRlciAvPgogICAgICA8UmV2ZWFsPgogICAgICAgIDxHdWVzdGJvb2tTZWN0aW9u' +
  'IC8+CiAgICAgIDwvUmV2ZWFsPgoKICAgICAgPFJldmVhbD4KICAgICAgICA8Rm9vdGVyIHR5cGU9e3ZpZXcudHlwZX0gLz4KICAgICAgPC9SZXZlYWw+CiAg' +
  'ICA8Lz4KICApOwp9Cg=='
)

Write-ProjectFile -Path 'src\pages\AnnouncementPage.jsx' -Base64 (
  'aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JzsKLy8g7Jm467aAIOyVjOumvOyaqSDtjpjsnbTsp4Ag4oCUIOyepeyGjCDCtyDsmIjsi53snqUg7JWI64K0IMK3' +
  'IOqzhOyijCDCtyBSU1ZQIOulvCDroIzrjZTrp4HtlZjsp4Ag7JWK64qU64ukLgovLyAo7KGw6rG067aAIOyIqOq5gOydtCDslYTri4jrnbwg7JWE7JiIIGlt' +
  'cG9ydCDtlZjsp4Ag7JWK7JWELCDrsojrk6Tsl5DshJwg6rOE7KKM67KI7Zi46rCAIOuFuOy2nOuQoCDsl6zsp4Drpbwg7KSE7J2464ukLikKaW1wb3J0IElu' +
  'dHJvU2VjdGlvbiBmcm9tICcuLi9jb21wb25lbnRzL2NvbW1vbi9JbnRyb1NlY3Rpb24nOwppbXBvcnQgR3JlZXRpbmdTZWN0aW9uIGZyb20gJy4uL2NvbXBv' +
  'bmVudHMvY29tbW9uL0dyZWV0aW5nU2VjdGlvbic7CmltcG9ydCBEZGF5U2VjdGlvbiBmcm9tICcuLi9jb21wb25lbnRzL2NvbW1vbi9EZGF5U2VjdGlvbic7' +
  'CmltcG9ydCBTdG9yeVNlY3Rpb24gZnJvbSAnLi4vY29tcG9uZW50cy9jb21tb24vU3RvcnlTZWN0aW9uJzsKaW1wb3J0IEdhbGxlcnlTZWN0aW9uIGZyb20g' +
  'Jy4uL2NvbXBvbmVudHMvY29tbW9uL0dhbGxlcnlTZWN0aW9uJzsKaW1wb3J0IENvbnRhY3RTZWN0aW9uIGZyb20gJy4uL2NvbXBvbmVudHMvY29tbW9uL0Nv' +
  'bnRhY3RTZWN0aW9uJzsKaW1wb3J0IEd1ZXN0Ym9va1NlY3Rpb24gZnJvbSAnLi4vY29tcG9uZW50cy9jb21tb24vR3Vlc3Rib29rU2VjdGlvbic7CmltcG9y' +
  'dCBTZWN0aW9uRGl2aWRlciBmcm9tICcuLi9jb21wb25lbnRzL2NvbW1vbi9TZWN0aW9uRGl2aWRlcic7CmltcG9ydCBSZXZlYWwgZnJvbSAnLi4vY29tcG9u' +
  'ZW50cy9jb21tb24vUmV2ZWFsJzsKaW1wb3J0IEZvb3RlciBmcm9tICcuLi9jb21wb25lbnRzL2NvbW1vbi9Gb290ZXInOwppbXBvcnQgTm90aWNlU2VjdGlv' +
  'biBmcm9tICcuLi9jb21wb25lbnRzL3B1YmxpYy9Ob3RpY2VTZWN0aW9uJzsKCmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFubm91bmNlbWVudFBhZ2UoeyB2' +
  'aWV3IH0pIHsKICByZXR1cm4gKAogICAgPD4KICAgICAgPEludHJvU2VjdGlvbiB2aWV3PXt2aWV3fSAvPgoKICAgICAgPFNlY3Rpb25EaXZpZGVyIC8+CiAg' +
  'ICAgIDxSZXZlYWw+CiAgICAgICAgPEdyZWV0aW5nU2VjdGlvbiB2aWV3PXt2aWV3fSAvPgogICAgICA8L1JldmVhbD4KCiAgICAgIDxTZWN0aW9uRGl2aWRl' +
  'ciAvPgogICAgICA8UmV2ZWFsPgogICAgICAgIDxEZGF5U2VjdGlvbiB2aWV3PXt2aWV3fSAvPgogICAgICA8L1JldmVhbD4KCiAgICAgIDxTZWN0aW9uRGl2' +
  'aWRlciAvPgogICAgICA8UmV2ZWFsPgogICAgICAgIDxTdG9yeVNlY3Rpb24gLz4KICAgICAgPC9SZXZlYWw+CgogICAgICA8U2VjdGlvbkRpdmlkZXIgLz4K' +
  'ICAgICAgPFJldmVhbD4KICAgICAgICA8R2FsbGVyeVNlY3Rpb24gLz4KICAgICAgPC9SZXZlYWw+CgogICAgICA8U2VjdGlvbkRpdmlkZXIgLz4KICAgICAg' +
  'PFJldmVhbD4KICAgICAgICA8Tm90aWNlU2VjdGlvbiAvPgogICAgICA8L1JldmVhbD4KCiAgICAgIDxTZWN0aW9uRGl2aWRlciAvPgogICAgICA8UmV2ZWFs' +
  'PgogICAgICAgIDxDb250YWN0U2VjdGlvbiAvPgogICAgICA8L1JldmVhbD4KCiAgICAgIDxTZWN0aW9uRGl2aWRlciAvPgogICAgICA8UmV2ZWFsPgogICAg' +
  'ICAgIDxHdWVzdGJvb2tTZWN0aW9uIC8+CiAgICAgIDwvUmV2ZWFsPgoKICAgICAgPFJldmVhbD4KICAgICAgICA8Rm9vdGVyIHR5cGU9e3ZpZXcudHlwZX0g' +
  'Lz4KICAgICAgPC9SZXZlYWw+CiAgICA8Lz4KICApOwp9Cg=='
)

Write-ProjectFile -Path 'src\App.jsx' -Base64 (
  'aW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnOwppbXBvcnQgeyBDT05GSUcgfSBmcm9tICcuL2NvbmZpZy9pbnZpdGF0aW9uQ29uZmln' +
  'JzsKaW1wb3J0IHsgdXNlSW52aXRhdGlvbiB9IGZyb20gJy4vaG9va3MvdXNlSW52aXRhdGlvbic7CmltcG9ydCBDdXJ0YWluQ292ZXIgZnJvbSAnLi9jb21w' +
  'b25lbnRzL2NvbW1vbi9DdXJ0YWluQ292ZXInOwppbXBvcnQgVGhlbWVTd2l0Y2hlciBmcm9tICcuL2NvbXBvbmVudHMvY29tbW9uL1RoZW1lU3dpdGNoZXIn' +
  'OwppbXBvcnQgR3Vlc3RQYWdlIGZyb20gJy4vcGFnZXMvR3Vlc3RQYWdlJzsKaW1wb3J0IEFubm91bmNlbWVudFBhZ2UgZnJvbSAnLi9wYWdlcy9Bbm5vdW5j' +
  'ZW1lbnRQYWdlJzsKCmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCgpIHsKICBjb25zdCB7IHR5cGUsIHZpZXcsIHRoZW1lSWQsIHNldFRoZW1lIH0gPSB1' +
  'c2VJbnZpdGF0aW9uKCk7CiAgY29uc3QgW29wZW5lZCwgc2V0T3BlbmVkXSA9IHVzZVN0YXRlKCFDT05GSUcudXNlQ3VydGFpbik7CgogIC8vIOyiheulmOyX' +
  'kCDrlLDrnbwg67O07Jes7KSEIO2OmOydtOyngOunjCDqsIjslYTrgbzsmrTri6QuIO2FjOuniOyZgOuKlCDrrLTqtIDtlZjqsowg64+Z7J6R7ZWc64ukLgog' +
  'IGNvbnN0IFBhZ2UgPSB0eXBlID09PSAnZ3Vlc3QnID8gR3Vlc3RQYWdlIDogQW5ub3VuY2VtZW50UGFnZTsKCiAgcmV0dXJuICgKICAgIDw+CiAgICAgIHtv' +
  'cGVuZWQgPyAoCiAgICAgICAgPGRpdiBjbGFzc05hbWU9Im1vYmlsZS1jb250YWluZXIgdGV4dC1pbmsiPgogICAgICAgICAgPFBhZ2Ugdmlldz17dmlld30g' +
  'Lz4KICAgICAgICA8L2Rpdj4KICAgICAgKSA6ICgKICAgICAgICA8Q3VydGFpbkNvdmVyIG9uT3Blbj17KCkgPT4gc2V0T3BlbmVkKHRydWUpfSB2aWV3PXt2' +
  'aWV3fSAvPgogICAgICApfQoKICAgICAgey8qIO2FjOuniCDqs6DrpbTripQg64+Z7JWI66eMIOuFuOy2nC4g7KCV7ZWcIOuSpCBhbGxvd1RoZW1lUHJldmll' +
  'dyDrpbwgZmFsc2Ug66GcIOuwlOq+uOuptCDsgqzrnbzsp4Tri6QgKi99CiAgICAgIHtDT05GSUcuYWxsb3dUaGVtZVByZXZpZXcgJiYgPFRoZW1lU3dpdGNo' +
  'ZXIgY3VycmVudD17dGhlbWVJZH0gb25DaGFuZ2U9e3NldFRoZW1lfSAvPn0KICAgIDwvPgogICk7Cn0K'
)


Write-Host ''
$checks = @(
  @{ Name = '노출 규칙 파일';   Path = 'src\lib\visibility.js';                    Pattern = 'showsTime' },
  @{ Name = '첫 화면';          Path = 'src\components\common\CurtainCover.jsx';   Pattern = 'showsVenue' },
  @{ Name = '히어로';           Path = 'src\components\common\IntroSection.jsx';   Pattern = 'showsTime' },
  @{ Name = 'D-DAY';            Path = 'src\components\common\DdaySection.jsx';    Pattern = 'showsTime' },
  @{ Name = '외부용 페이지';     Path = 'src\pages\AnnouncementPage.jsx';            Pattern = 'view=\{view\}' }
)

foreach ($c in $checks) {
  if (Select-String -Path $c.Path -Pattern $c.Pattern -Quiet) {
    Write-Host ('  [OK] ' + $c.Name) -ForegroundColor Green
  } else {
    Write-Host ('  [실패] ' + $c.Name) -ForegroundColor Red
  }
}

Write-Host ''
Write-Host '확인:' -ForegroundColor Cyan
Write-Host '  http://localhost:5173/mobile-invitation/              날짜만'
Write-Host '  http://localhost:5173/mobile-invitation/?type=guest   날짜 + 시간 + 예식장'
