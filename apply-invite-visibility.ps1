<#
  외부 알림용 / 내빈용 노출 정보 정리  (하나로 합친 최종본)

  앞서 드린 apply-curtain-announcement.ps1 과 apply-announcement-hide.ps1 을
  이 스크립트가 모두 포함합니다. 그것들을 실행했는지와 무관하게 이것만 실행하면 됩니다.

  첫 화면 (커튼)
    외부용            내빈용
    ----------        ----------------------
    WEDDING           INVITATION
    ANNOUNCEMENT
    2026.12.19        2026.12.19
    (아래 줄 없음)     토요일 오후 1시
                      OO웨딩홀 3층 단독홀
    [소식 보기]        [초대장 열기]

  히어로 사진 / D-DAY 부제
    외부용 : 2026년 12월 19일 토요일          (시간 없음)
    내빈용 : 2026년 12월 19일 토요일 오후 1시

  큰 글씨에 이미 날짜가 있으므로 커튼 아래 줄에서는 날짜를 반복하지 않습니다.

  바뀌는 파일 8개:
    src\lib\visibility.js                      (새 파일) 노출 규칙 한곳 관리
    src\lib\format.js                          요일만 뽑는 함수 추가
    src\components\common\CurtainCover.jsx
    src\components\common\IntroSection.jsx
    src\components\common\DdaySection.jsx
    src\pages\GuestPage.jsx
    src\pages\AnnouncementPage.jsx
    src\App.jsx

  ⚠️ invitationConfig.js 는 건드리지 않습니다. (차녀 · mainPhoto · 캡션 유지)

  두는 곳: C:\Users\sb622\OneDrive\문서\GitHub\mobile-invitation\apply-invite-visibility.ps1
  실행:
      cd "C:\Users\sb622\OneDrive\문서\GitHub\mobile-invitation"
      powershell -ExecutionPolicy Bypass -File .\apply-invite-visibility.ps1

  되돌리려면:
      git checkout -- src/components src/pages src/lib src/App.jsx
      Remove-Item src\lib\visibility.js
#>

$ErrorActionPreference = 'Stop'

if (-not (Test-Path .\package.json)) {
  Write-Host '프로젝트 폴더에서 실행하세요 (package.json 이 있는 곳).' -ForegroundColor Red
  Write-Host ('현재 위치: ' + (Get-Location)) -ForegroundColor Yellow
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

Write-ProjectFile -Path 'src\lib\format.js' -Base64 (
  'aW1wb3J0IHsgQ09ORklHIH0gZnJvbSAnLi4vY29uZmlnL2ludml0YXRpb25Db25maWcnOwoKY29uc3QgV0VFS0RBWVMgPSBbJ+ydvCcsICfsm5QnLCAn7ZmU' +
  'JywgJ+yImCcsICfrqqknLCAn6riIJywgJ+2GoCddOwoKLyoqICcyMDI2LTEyLTE5JyArICcxMzowMCcg4oaSIERhdGUg6rCd7LK0ICjroZzsu6wg7Iuc6rCE' +
  'IOq4sOykgCkgKi8KZXhwb3J0IGZ1bmN0aW9uIHdlZGRpbmdEYXRlKCkgewogIGNvbnN0IFt5LCBtLCBkXSA9IENPTkZJRy53ZWRkaW5nLmRhdGUuc3BsaXQo' +
  'Jy0nKS5tYXAoTnVtYmVyKTsKICBjb25zdCBbaGgsIG1tXSA9IENPTkZJRy53ZWRkaW5nLnRpbWUuc3BsaXQoJzonKS5tYXAoTnVtYmVyKTsKICByZXR1cm4g' +
  'bmV3IERhdGUoeSwgbSAtIDEsIGQsIGhoLCBtbSwgMCwgMCk7Cn0KCi8qKiAyMDI264WEIDEy7JuUIDE57J28IO2GoOyalOydvCAqLwpleHBvcnQgZnVuY3Rp' +
  'b24gZm9ybWF0RnVsbERhdGUoKSB7CiAgY29uc3QgZHQgPSB3ZWRkaW5nRGF0ZSgpOwogIHJldHVybiBgJHtkdC5nZXRGdWxsWWVhcigpfeuFhCAke2R0Lmdl' +
  'dE1vbnRoKCkgKyAxfeyblCAke2R0LmdldERhdGUoKX3snbwgJHtXRUVLREFZU1tkdC5nZXREYXkoKV197JqU7J28YDsKfQoKLyoqIOyYpO2bhCAx7IucIC8g' +
  '7Jik7ZuEIDHsi5wgMzDrtoQgKi8KZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFRpbWUoKSB7CiAgY29uc3QgZHQgPSB3ZWRkaW5nRGF0ZSgpOwogIGNvbnN0IGgg' +
  'PSBkdC5nZXRIb3VycygpOwogIGNvbnN0IG0gPSBkdC5nZXRNaW51dGVzKCk7CiAgY29uc3QgbWVyaWRpZW0gPSBoIDwgMTIgPyAn7Jik7KCEJyA6ICfsmKTt' +
  'm4QnOwogIGNvbnN0IGgxMiA9IGggJSAxMiA9PT0gMCA/IDEyIDogaCAlIDEyOwogIHJldHVybiBtID09PSAwID8gYCR7bWVyaWRpZW19ICR7aDEyfeyLnGAg' +
  'OiBgJHttZXJpZGllbX0gJHtoMTJ97IucICR7bX3rtoRgOwp9CgovKiog7Yag7JqU7J28ICovCmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRXZWVrZGF5KCkgewog' +
  'IHJldHVybiBgJHtXRUVLREFZU1t3ZWRkaW5nRGF0ZSgpLmdldERheSgpXX3smpTsnbxgOwp9CgovKiogMjAyNi4xMi4xOSAqLwpleHBvcnQgZnVuY3Rpb24g' +
  'Zm9ybWF0U2hvcnREYXRlKCkgewogIHJldHVybiBDT05GSUcud2VkZGluZy5kYXRlLnJlcGxhY2VBbGwoJy0nLCAnLicpOwp9CgovKiog6rOg7J247J2066m0' +
  'IOydtOumhCDslZ7sl5Ag5pWFIOulvCDrtpnsnbjri6QgKi8KZXhwb3J0IGZ1bmN0aW9uIHdpdGhEZWNlYXNlZChuYW1lLCBkZWNlYXNlZCkgewogIHJldHVy' +
  'biBkZWNlYXNlZCA/IGDmlYUgJHtuYW1lfWAgOiBuYW1lOwp9Cg=='
)

Write-ProjectFile -Path 'src\components\common\CurtainCover.jsx' -Base64 (
  'aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JzsKaW1wb3J0IHsgQ09ORklHIH0gZnJvbSAnLi4vLi4vY29uZmlnL2ludml0YXRpb25Db25maWcnOwppbXBvcnQg' +
  'eyBmb3JtYXRXZWVrZGF5LCBmb3JtYXRUaW1lLCBmb3JtYXRTaG9ydERhdGUgfSBmcm9tICcuLi8uLi9saWIvZm9ybWF0JzsKaW1wb3J0IHsgc2hvd3NUaW1l' +
  'LCBzaG93c1ZlbnVlIH0gZnJvbSAnLi4vLi4vbGliL3Zpc2liaWxpdHknOwoKLyoqCiAqIOyyqyDtmZTrqbQgKENPTkZJRy51c2VDdXJ0YWluIOydtCB0cnVl' +
  'IOydvCDrlYzrp4wg7ZGc7IucKQogKgogKiA0ODBweCDsu6jthYzsnbTrhIjsl5Ag6rCH7Z6I7KeAIOyViuqzoCDtmZTrqbQg7KCE7LK066W8IOyxhOyatOuL' +
  'pC4KICog7IKs7KeEIOyXhuydtCwg7LKt7LKp7J6lIOy5tOuTnOyymOufvCDsnbTspJEg7YWM65GQ66as7JmAIOq4gOyekOunjOycvOuhnCDqtazshLHtlojr' +
  'i6QuCiAqCiAqIOunge2BrCDsooXrpZjsl5Ag65Sw6528IOyEseqyqeydtCDri6TrpbTrr4DroZwg66y46rWs7JmAIOuFuOy2nCDsoJXrs7Trpbwg64KY64iI' +
  '64ukLgogKiAgIOuCtOu5iOyaqSA6ICdJTlZJVEFUSU9OJyAvICfstIjrjIDsnqUg7Je06riwJwogKiAgICAgICAgICAgICAgMjAyNi4xMi4xOQogKiAgICAg' +
  'ICAgICAgICAg7Yag7JqU7J28IOyYpO2bhCAx7IucCiAqICAgICAgICAgICAgICBPT+ybqOuUqe2ZgCAz7Li1IOuLqOuPhe2ZgAogKgogKiAgIOyZuOu2gOya' +
  'qSA6ICdXRURESU5HIEFOTk9VTkNFTUVOVCcgLyAn7IaM7IudIOuztOq4sCcKICogICAgICAgICAgICAgIDIwMjYuMTIuMTkKICogICAgICAgICAgICAgICjs' +
  'lYTrnpgg7KSEIOyXhuydjCkKICoKICog7YGwIOq4gOyUqOyXkCDsnbTrr7gg64Kg7Kec6rCAIOyeiOycvOuvgOuhnCDslYTrnpgg7KSE7JeQ7ISc64qUIOuC' +
  'oOynnOulvCDrsJjrs7XtlZjsp4Ag7JWK6rOgCiAqIOyalOydvOqzvCDsi5zqsITrp4wg7KCB64qU64ukLgogKgogKiDsmbjrtoAg7IaQ64uY7J2AIOy0iOuM' +
  'gO2VmOyngCDslYrsnLzrr4DroZwsIOyZuOu2gOyaqeyXkOyEnOuKlCDsi5zqsITqs7wg7JiI7Iud7J6l7J2EIO2RnOyLnO2VmOyngCDslYrripTri6QuCiAq' +
  'ICjsmKTsi5zrnbzripQg65y77Jy866GcIOydve2ekCDsoJXrs7Trpbwg64Ko6riw7KeAIOyViuuKlOuLpCkKICogKOusuOq1rOulvCDrsJTqvrjqs6Ag7Iu2' +
  '7Jy866m0IGludml0YXRpb25Db25maWcuanMg7J2YIOqwgSDsooXrpZjsl5AKICogIGN1cnRhaW5MYWJlbCAvIGN1cnRhaW5CdXR0b24g7J2EIOy2lOqwgO2V' +
  'mOuptCDqt7gg6rCS7J20IOyasOyEoO2VnOuLpCkKICovCmNvbnN0IENVUlRBSU5fVEVYVCA9IHsKICBndWVzdDogeyBsYWJlbDogJ0lOVklUQVRJT04nLCBi' +
  'dXR0b246ICfstIjrjIDsnqUg7Je06riwJyB9LAogIGFubm91bmNlbWVudDogeyBsYWJlbDogJ1dFRERJTkcgQU5OT1VOQ0VNRU5UJywgYnV0dG9uOiAn7IaM' +
  '7IudIOuztOq4sCcgfSwKfTsKCmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEN1cnRhaW5Db3Zlcih7IG9uT3BlbiwgdmlldyB9KSB7CiAgY29uc3QgeyBncm9v' +
  'bSwgYnJpZGUgfSA9IENPTkZJRy5jb3VwbGU7CiAgY29uc3QgeyB2ZW51ZSwgaGFsbCB9ID0gQ09ORklHLndlZGRpbmc7CgogIGNvbnN0IHByZXNldCA9IENV' +
  'UlRBSU5fVEVYVFt2aWV3Py50eXBlXSA/PyBDVVJUQUlOX1RFWFQuYW5ub3VuY2VtZW50OwogIGNvbnN0IGxhYmVsID0gdmlldz8uY3VydGFpbkxhYmVsID8/' +
  'IHByZXNldC5sYWJlbDsKICBjb25zdCBidXR0b25UZXh0ID0gdmlldz8uY3VydGFpbkJ1dHRvbiA/PyBwcmVzZXQuYnV0dG9uOwoKICByZXR1cm4gKAogICAg' +
  'PGRpdiBjbGFzc05hbWU9ImNvdmVyLXNjcmVlbiBmaXhlZCBpbnNldC0wIHotNDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgb3ZlcmZsb3ct' +
  'aGlkZGVuIGJnLWJnIHB4LTYgdGV4dC1pbmsiPgogICAgICB7Lyog7LKt7LKp7J6lIOy5tOuTnCDripDrgozsnZgg7J207KSRIO2FjOuRkOumrCAqL30KICAg' +
  'ICAgPGRpdiBjbGFzc05hbWU9ImNvdmVyLWZyYW1lIHBvaW50ZXItZXZlbnRzLW5vbmUgYWJzb2x1dGUgaW5zZXQtNCBib3JkZXIgYm9yZGVyLWxpbmUvMjUg' +
  'c206aW5zZXQtOCIgLz4KICAgICAgPGRpdgogICAgICAgIGNsYXNzTmFtZT0iY292ZXItZnJhbWUgcG9pbnRlci1ldmVudHMtbm9uZSBhYnNvbHV0ZSBpbnNl' +
  'dC1bMjJweF0gYm9yZGVyIGJvcmRlci1saW5lLzEyIHNtOmluc2V0LVszOHB4XSIKICAgICAgICBzdHlsZT17eyBhbmltYXRpb25EZWxheTogJzE0MG1zJyB9' +
  'fQogICAgICAvPgoKICAgICAgPGRpdiBjbGFzc05hbWU9InJlbGF0aXZlIGZsZXggdy1mdWxsIG1heC13LXNtIGZsZXgtY29sIGl0ZW1zLWNlbnRlciBnYXAt' +
  'MTIgdGV4dC1jZW50ZXIiPgogICAgICAgIDxwIGNsYXNzTmFtZT0iYW5pbWF0ZS1lbnRlciBmb250LWJhdGFuZyB0ZXh0LVsxMHB4XSB0cmFja2luZy1bMC41' +
  'NWVtXSB0ZXh0LWFjY2VudCI+CiAgICAgICAgICB7bGFiZWx9CiAgICAgICAgPC9wPgoKICAgICAgICA8ZGl2IGNsYXNzTmFtZT0iYW5pbWF0ZS1lbnRlciBz' +
  'cGFjZS15LTUiIHN0eWxlPXt7IGFuaW1hdGlvbkRlbGF5OiAnMjUwbXMnIH19PgogICAgICAgICAgPGgxIGNsYXNzTmFtZT0iZm9udC1iYXRhbmcgdGV4dC1b' +
  'Mi42cmVtXSBmb250LWJvbGQgbGVhZGluZy1ub25lIj57Z3Jvb20ubmFtZX08L2gxPgoKICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSJmbGV4IGl0ZW1zLWNl' +
  'bnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMyI+CiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0iaC1weCB3LTggYmctbGluZS80MCIgYXJpYS1oaWRkZW49' +
  'InRydWUiIC8+CiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0iZm9udC1iYXRhbmcgdGV4dC14cyB0ZXh0LWFjY2VudCI+6re466as6rOgPC9zcGFuPgog' +
  'ICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9ImgtcHggdy04IGJnLWxpbmUvNDAiIGFyaWEtaGlkZGVuPSJ0cnVlIiAvPgogICAgICAgICAgPC9kaXY+Cgog' +
  'ICAgICAgICAgPGgxIGNsYXNzTmFtZT0iZm9udC1iYXRhbmcgdGV4dC1bMi42cmVtXSBmb250LWJvbGQgbGVhZGluZy1ub25lIj57YnJpZGUubmFtZX08L2gx' +
  'PgogICAgICAgIDwvZGl2PgoKICAgICAgICA8ZGl2IGNsYXNzTmFtZT0iYW5pbWF0ZS1lbnRlciBzcGFjZS15LTIiIHN0eWxlPXt7IGFuaW1hdGlvbkRlbGF5' +
  'OiAnNDUwbXMnIH19PgogICAgICAgICAgPHAgY2xhc3NOYW1lPSJmb250LWJhdGFuZyB0ZXh0LWJhc2UgdHJhY2tpbmctWzAuMmVtXSB0ZXh0LWFjY2VudCB0' +
  'YWJ1bGFyLW51bXMiPgogICAgICAgICAgICB7Zm9ybWF0U2hvcnREYXRlKCl9CiAgICAgICAgICA8L3A+CiAgICAgICAgICB7KHNob3dzVGltZSh2aWV3KSB8' +
  'fCBzaG93c1ZlbnVlKHZpZXcpKSAmJiAoCiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0idGV4dC14cyBsZWFkaW5nLTYgdGV4dC1tdXRlZCI+CiAgICAgICAg' +
  'ICAgICAge3Nob3dzVGltZSh2aWV3KSAmJiBgJHtmb3JtYXRXZWVrZGF5KCl9ICR7Zm9ybWF0VGltZSgpfWB9CiAgICAgICAgICAgICAge3Nob3dzVGltZSh2' +
  'aWV3KSAmJiBzaG93c1ZlbnVlKHZpZXcpICYmIDxiciAvPn0KICAgICAgICAgICAgICB7c2hvd3NWZW51ZSh2aWV3KSAmJiBgJHt2ZW51ZX0gJHtoYWxsfWB9' +
  'CiAgICAgICAgICAgIDwvcD4KICAgICAgICAgICl9CiAgICAgICAgPC9kaXY+CgogICAgICAgIDxidXR0b24KICAgICAgICAgIG9uQ2xpY2s9e29uT3Blbn0K' +
  'ICAgICAgICAgIGNsYXNzTmFtZT0iYW5pbWF0ZS1lbnRlciByb3VuZGVkLWZ1bGwgYm9yZGVyIGJvcmRlci1saW5lIGJnLWFjY2VudCBweC05IHB5LTMuNSB0' +
  'ZXh0LXNtIGZvbnQtYm9sZCB0cmFja2luZy13aWRlIHRleHQtYWNjZW50LWZnIHNoYWRvdy1sZyB0cmFuc2l0aW9uLXRyYW5zZm9ybSBhY3RpdmU6c2NhbGUt' +
  'OTUiCiAgICAgICAgICBzdHlsZT17eyBhbmltYXRpb25EZWxheTogJzY1MG1zJyB9fQogICAgICAgID4KICAgICAgICAgIHtidXR0b25UZXh0fQogICAgICAg' +
  'IDwvYnV0dG9uPgogICAgICA8L2Rpdj4KICAgIDwvZGl2PgogICk7Cn0K'
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
  @{ Name = '노출 규칙 파일';      Path = 'src\lib\visibility.js';                  Pattern = 'showsTime' },
  @{ Name = '요일 함수';           Path = 'src\lib\format.js';                      Pattern = 'formatWeekday' },
  @{ Name = '커튼 날짜 중복 제거';  Path = 'src\components\common\CurtainCover.jsx'; Pattern = 'formatWeekday' },
  @{ Name = '히어로 시간 숨김';     Path = 'src\components\common\IntroSection.jsx'; Pattern = 'showsTime' },
  @{ Name = 'D-DAY 시간 숨김';      Path = 'src\components\common\DdaySection.jsx';  Pattern = 'showsTime' },
  @{ Name = '외부용 페이지 전달';   Path = 'src\pages\AnnouncementPage.jsx';          Pattern = 'view=\{view\}' }
)

$fail = 0
foreach ($c in $checks) {
  if (Select-String -Path $c.Path -Pattern $c.Pattern -Quiet) {
    Write-Host ('  [OK] ' + $c.Name) -ForegroundColor Green
  } else {
    Write-Host ('  [실패] ' + $c.Name) -ForegroundColor Red
    $fail++
  }
}

Write-Host ''
if ($fail -eq 0) {
  Write-Host '모두 적용됐습니다.' -ForegroundColor Green
} else {
  Write-Host "$fail 건 실패. 위 목록을 알려주세요." -ForegroundColor Red
}

Write-Host ''
Write-Host '개발 서버를 껐다가 다시 켜고 (Ctrl+C 후 npm run dev)' -ForegroundColor Cyan
Write-Host '브라우저는 Ctrl+Shift+R 로 새로고침하세요.' -ForegroundColor Cyan
Write-Host ''
Write-Host '  http://localhost:5173/mobile-invitation/              외부용'
Write-Host '  http://localhost:5173/mobile-invitation/?type=guest   내빈용'
