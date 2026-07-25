<#
  외부 알림용 첫 화면 문구 분리 + 예식장 숨김

  무엇이 바뀌나:
    외부 알림용 (파라미터 없는 주소)
      상단  INVITATION            ->  WEDDING ANNOUNCEMENT
      버튼  초대장 열기            ->  소식 보기
      정보  날짜 + 예식장          ->  날짜만 (예식장 숨김)

    내빈용 (?type=guest) 은 지금과 동일하게 유지됩니다.

  바뀌는 파일 2개:
    src\components\common\CurtainCover.jsx
    src\App.jsx                                (커튼에 링크 종류를 넘겨주는 한 줄)

  ⚠️ invitationConfig.js 는 건드리지 않습니다.

  두는 곳: C:\Users\sb622\OneDrive\문서\GitHub\mobile-invitation\apply-curtain-announcement.ps1
  실행:
      cd "C:\Users\sb622\OneDrive\문서\GitHub\mobile-invitation"
      powershell -ExecutionPolicy Bypass -File .\apply-curtain-announcement.ps1

  되돌리려면:
      git checkout -- src/components/common/CurtainCover.jsx src/App.jsx
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

Write-ProjectFile -Path 'src\components\common\CurtainCover.jsx' -Base64 (
  'aW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JzsKaW1wb3J0IHsgQ09ORklHIH0gZnJvbSAnLi4vLi4vY29uZmlnL2ludml0YXRpb25Db25maWcnOwppbXBvcnQg' +
  'eyBmb3JtYXRGdWxsRGF0ZSwgZm9ybWF0VGltZSwgZm9ybWF0U2hvcnREYXRlIH0gZnJvbSAnLi4vLi4vbGliL2Zvcm1hdCc7CgovKioKICog7LKrIO2ZlOup' +
  'tCAoQ09ORklHLnVzZUN1cnRhaW4g7J20IHRydWUg7J28IOuVjOunjCDtkZzsi5wpCiAqCiAqIDQ4MHB4IOy7qO2FjOydtOuEiOyXkCDqsIftnojsp4Ag7JWK' +
  '6rOgIO2ZlOuptCDsoITssrTrpbwg7LGE7Jq064ukLgogKiDsgqzsp4Qg7JeG7J20LCDssq3ssqnsnqUg7Lm065Oc7LKY65+8IOydtOykkSDthYzrkZDrpqzs' +
  'mYAg6riA7J6Q66eM7Jy866GcIOq1rOyEse2WiOuLpC4KICoKICog66eB7YGsIOyiheulmOyXkCDrlLDrnbwg7ISx6rKp7J20IOuLpOultOuvgOuhnCDrrLjq' +
  'tazsmYAg64W47LacIOygleuztOulvCDrgpjriIjri6QuCiAqICAg64K067mI7JqpIDog7LSI64yA7ZWY64qUIOyekOumrCDihpIgJ0lOVklUQVRJT04nIC8g' +
  'J+y0iOuMgOyepSDsl7TquLAnIC8g64Kg7KecICsg7JiI7Iud7J6lCiAqICAg7Jm467aA7JqpIDog7JWM66as64qUIOyGjOyLnSAgIOKGkiAnV0VERElORyBB' +
  'Tk5PVU5DRU1FTlQnIC8gJ+yGjOyLnSDrs7TquLAnIC8g64Kg7Kec66eMCiAqCiAqIOyZuOu2gCDshpDri5jsnYAg7LSI64yA7ZWY7KeAIOyViuycvOuvgOuh' +
  'nCwg7Jm467aA7Jqp7JeQ7ISc64qUIOyYiOyLneyepeydhCDslYTsmIgg7ZGc7Iuc7ZWY7KeAIOyViuuKlOuLpC4KICogKOusuOq1rOulvCDrsJTqvrjqs6Ag' +
  '7Iu27Jy866m0IGludml0YXRpb25Db25maWcuanMg7J2YIOqwgSDsooXrpZjsl5AKICogIGN1cnRhaW5MYWJlbCAvIGN1cnRhaW5CdXR0b24g7J2EIOy2lOqw' +
  'gO2VmOuptCDqt7gg6rCS7J20IOyasOyEoO2VnOuLpCkKICovCmNvbnN0IENVUlRBSU5fVEVYVCA9IHsKICBndWVzdDogeyBsYWJlbDogJ0lOVklUQVRJT04n' +
  'LCBidXR0b246ICfstIjrjIDsnqUg7Je06riwJywgc2hvd1ZlbnVlOiB0cnVlIH0sCiAgYW5ub3VuY2VtZW50OiB7IGxhYmVsOiAnV0VERElORyBBTk5PVU5D' +
  'RU1FTlQnLCBidXR0b246ICfshozsi50g67O06riwJywgc2hvd1ZlbnVlOiBmYWxzZSB9LAp9OwoKZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ3VydGFpbkNv' +
  'dmVyKHsgb25PcGVuLCB2aWV3IH0pIHsKICBjb25zdCB7IGdyb29tLCBicmlkZSB9ID0gQ09ORklHLmNvdXBsZTsKICBjb25zdCB7IHZlbnVlLCBoYWxsIH0g' +
  'PSBDT05GSUcud2VkZGluZzsKCiAgY29uc3QgcHJlc2V0ID0gQ1VSVEFJTl9URVhUW3ZpZXc/LnR5cGVdID8/IENVUlRBSU5fVEVYVC5hbm5vdW5jZW1lbnQ7' +
  'CiAgY29uc3QgbGFiZWwgPSB2aWV3Py5jdXJ0YWluTGFiZWwgPz8gcHJlc2V0LmxhYmVsOwogIGNvbnN0IGJ1dHRvblRleHQgPSB2aWV3Py5jdXJ0YWluQnV0' +
  'dG9uID8/IHByZXNldC5idXR0b247CgogIHJldHVybiAoCiAgICA8ZGl2IGNsYXNzTmFtZT0iY292ZXItc2NyZWVuIGZpeGVkIGluc2V0LTAgei00MCBmbGV4' +
  'IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBvdmVyZmxvdy1oaWRkZW4gYmctYmcgcHgtNiB0ZXh0LWluayI+CiAgICAgIHsvKiDssq3ssqnsnqUg7Lm0' +
  '65OcIOuKkOuCjOydmCDsnbTspJEg7YWM65GQ66asICovfQogICAgICA8ZGl2IGNsYXNzTmFtZT0iY292ZXItZnJhbWUgcG9pbnRlci1ldmVudHMtbm9uZSBh' +
  'YnNvbHV0ZSBpbnNldC00IGJvcmRlciBib3JkZXItbGluZS8yNSBzbTppbnNldC04IiAvPgogICAgICA8ZGl2CiAgICAgICAgY2xhc3NOYW1lPSJjb3Zlci1m' +
  'cmFtZSBwb2ludGVyLWV2ZW50cy1ub25lIGFic29sdXRlIGluc2V0LVsyMnB4XSBib3JkZXIgYm9yZGVyLWxpbmUvMTIgc206aW5zZXQtWzM4cHhdIgogICAg' +
  'ICAgIHN0eWxlPXt7IGFuaW1hdGlvbkRlbGF5OiAnMTQwbXMnIH19CiAgICAgIC8+CgogICAgICA8ZGl2IGNsYXNzTmFtZT0icmVsYXRpdmUgZmxleCB3LWZ1' +
  'bGwgbWF4LXctc20gZmxleC1jb2wgaXRlbXMtY2VudGVyIGdhcC0xMiB0ZXh0LWNlbnRlciI+CiAgICAgICAgPHAgY2xhc3NOYW1lPSJhbmltYXRlLWVudGVy' +
  'IGZvbnQtYmF0YW5nIHRleHQtWzEwcHhdIHRyYWNraW5nLVswLjU1ZW1dIHRleHQtYWNjZW50Ij4KICAgICAgICAgIHtsYWJlbH0KICAgICAgICA8L3A+Cgog' +
  'ICAgICAgIDxkaXYgY2xhc3NOYW1lPSJhbmltYXRlLWVudGVyIHNwYWNlLXktNSIgc3R5bGU9e3sgYW5pbWF0aW9uRGVsYXk6ICcyNTBtcycgfX0+CiAgICAg' +
  'ICAgICA8aDEgY2xhc3NOYW1lPSJmb250LWJhdGFuZyB0ZXh0LVsyLjZyZW1dIGZvbnQtYm9sZCBsZWFkaW5nLW5vbmUiPntncm9vbS5uYW1lfTwvaDE+Cgog' +
  'ICAgICAgICAgPGRpdiBjbGFzc05hbWU9ImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0zIj4KICAgICAgICAgICAgPHNwYW4gY2xhc3NO' +
  'YW1lPSJoLXB4IHctOCBiZy1saW5lLzQwIiBhcmlhLWhpZGRlbj0idHJ1ZSIgLz4KICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSJmb250LWJhdGFuZyB0' +
  'ZXh0LXhzIHRleHQtYWNjZW50Ij7qt7jrpqzqs6A8L3NwYW4+CiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0iaC1weCB3LTggYmctbGluZS80MCIgYXJp' +
  'YS1oaWRkZW49InRydWUiIC8+CiAgICAgICAgICA8L2Rpdj4KCiAgICAgICAgICA8aDEgY2xhc3NOYW1lPSJmb250LWJhdGFuZyB0ZXh0LVsyLjZyZW1dIGZv' +
  'bnQtYm9sZCBsZWFkaW5nLW5vbmUiPnticmlkZS5uYW1lfTwvaDE+CiAgICAgICAgPC9kaXY+CgogICAgICAgIDxkaXYgY2xhc3NOYW1lPSJhbmltYXRlLWVu' +
  'dGVyIHNwYWNlLXktMiIgc3R5bGU9e3sgYW5pbWF0aW9uRGVsYXk6ICc0NTBtcycgfX0+CiAgICAgICAgICA8cCBjbGFzc05hbWU9ImZvbnQtYmF0YW5nIHRl' +
  'eHQtYmFzZSB0cmFja2luZy1bMC4yZW1dIHRleHQtYWNjZW50IHRhYnVsYXItbnVtcyI+CiAgICAgICAgICAgIHtmb3JtYXRTaG9ydERhdGUoKX0KICAgICAg' +
  'ICAgIDwvcD4KICAgICAgICAgIDxwIGNsYXNzTmFtZT0idGV4dC14cyBsZWFkaW5nLTYgdGV4dC1tdXRlZCI+CiAgICAgICAgICAgIHtmb3JtYXRGdWxsRGF0' +
  'ZSgpfSB7Zm9ybWF0VGltZSgpfQogICAgICAgICAgICB7cHJlc2V0LnNob3dWZW51ZSAmJiAoCiAgICAgICAgICAgICAgPD4KICAgICAgICAgICAgICAgIDxi' +
  'ciAvPgogICAgICAgICAgICAgICAge3ZlbnVlfSB7aGFsbH0KICAgICAgICAgICAgICA8Lz4KICAgICAgICAgICAgKX0KICAgICAgICAgIDwvcD4KICAgICAg' +
  'ICA8L2Rpdj4KCiAgICAgICAgPGJ1dHRvbgogICAgICAgICAgb25DbGljaz17b25PcGVufQogICAgICAgICAgY2xhc3NOYW1lPSJhbmltYXRlLWVudGVyIHJv' +
  'dW5kZWQtZnVsbCBib3JkZXIgYm9yZGVyLWxpbmUgYmctYWNjZW50IHB4LTkgcHktMy41IHRleHQtc20gZm9udC1ib2xkIHRyYWNraW5nLXdpZGUgdGV4dC1h' +
  'Y2NlbnQtZmcgc2hhZG93LWxnIHRyYW5zaXRpb24tdHJhbnNmb3JtIGFjdGl2ZTpzY2FsZS05NSIKICAgICAgICAgIHN0eWxlPXt7IGFuaW1hdGlvbkRlbGF5' +
  'OiAnNjUwbXMnIH19CiAgICAgICAgPgogICAgICAgICAge2J1dHRvblRleHR9CiAgICAgICAgPC9idXR0b24+CiAgICAgIDwvZGl2PgogICAgPC9kaXY+CiAg' +
  'KTsKfQo='
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
$ok1 = Select-String -Path 'src\components\common\CurtainCover.jsx' -Pattern 'showVenue' -Quiet
$ok2 = Select-String -Path 'src\App.jsx' -Pattern 'view=\{view\}' -Quiet

if ($ok1) { Write-Host '  [OK] 커튼 문구/장소 분리' -ForegroundColor Green }
else      { Write-Host '  [실패] 커튼 문구/장소 분리' -ForegroundColor Red }
if ($ok2) { Write-Host '  [OK] App 에서 종류 전달' -ForegroundColor Green }
else      { Write-Host '  [실패] App 에서 종류 전달' -ForegroundColor Red }

Write-Host ''
Write-Host '확인:' -ForegroundColor Cyan
Write-Host '  http://localhost:5173/mobile-invitation/              외부용 - 날짜만'
Write-Host '  http://localhost:5173/mobile-invitation/?type=guest   내빈용 - 날짜 + 예식장'
