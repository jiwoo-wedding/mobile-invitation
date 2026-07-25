<#
  갤러리 사진을 장소별 하위 폴더로 이동

  두는 곳: C:\Users\sb622\OneDrive\문서\GitHub\mobile-invitation\move-gallery-folders.ps1
  실행:
      cd "C:\Users\sb622\OneDrive\문서\GitHub\mobile-invitation"
      powershell -ExecutionPolicy Bypass -File .\move-gallery-folders.ps1

  파일명 앞글자를 보고 폴더를 정한다.
      aka*, lucky*  ->  Akarenga Warehouse
      hachi*        ->  Hachiman Zaka
      trapi*, trappi* -> Trappist Monastery

  파일명은 바꾸지 않는다. (invitationConfig.js 의 mainPhoto 가 계속 맞도록)
#>

$ErrorActionPreference = 'Stop'

if (-not (Test-Path .\package.json)) {
  Write-Host '프로젝트 폴더에서 실행하세요 (package.json 이 있는 곳).' -ForegroundColor Red
  Write-Host ('현재 위치: ' + (Get-Location)) -ForegroundColor Yellow
  exit 1
}

$galleryRoot = '.\src\assets\gallery'

if (-not (Test-Path $galleryRoot)) {
  Write-Host "갤러리 폴더가 없습니다: $galleryRoot" -ForegroundColor Red
  exit 1
}

# 접두어 -> 폴더 이름
$rules = @(
  @{ Prefixes = @('aka', 'lucky');    Folder = 'Akarenga Warehouse' },
  @{ Prefixes = @('hachi');           Folder = 'Hachiman Zaka' },
  @{ Prefixes = @('trapi', 'trappi'); Folder = 'Trappist Monastery' }
)

foreach ($rule in $rules) {
  $dir = Join-Path $galleryRoot $rule.Folder
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "폴더 생성: $($rule.Folder)" -ForegroundColor DarkGray
  }
}

$moved = 0
$left  = @()

# 최상단에 바로 있는 파일만 대상 (이미 하위 폴더에 있는 건 건드리지 않는다)
Get-ChildItem $galleryRoot -File | ForEach-Object {
  $file = $_
  $name = $file.Name.ToLower()

  $target = $null
  foreach ($rule in $rules) {
    foreach ($prefix in $rule.Prefixes) {
      if ($name.StartsWith($prefix)) { $target = $rule.Folder; break }
    }
    if ($target) { break }
  }

  if (-not $target) {
    $left += $file.Name
    return
  }

  $dest = Join-Path (Join-Path $galleryRoot $target) $file.Name
  Move-Item $file.FullName $dest -Force
  Write-Host ("  {0}  ->  {1}" -f $file.Name, $target)
  $script:moved++
}

Write-Host ''
Write-Host "이동 완료: $moved 장" -ForegroundColor Green

if ($left.Count -gt 0) {
  Write-Host ''
  Write-Host '규칙에 걸리지 않아 최상단에 남은 파일:' -ForegroundColor Yellow
  $left | ForEach-Object { Write-Host "  $_" }
  Write-Host '이 파일들은 갤러리 맨 뒤에 "기타" 그룹으로 나옵니다.' -ForegroundColor DarkGray
  Write-Host '직접 옮기시거나, 스크립트의 $rules 에 접두어를 추가하세요.' -ForegroundColor DarkGray
}

Write-Host ''
Write-Host '결과 구조:' -ForegroundColor Cyan
Get-ChildItem $galleryRoot -Directory | ForEach-Object {
  $count = (Get-ChildItem $_.FullName -File).Count
  Write-Host ("  {0}  ({1}장)" -f $_.Name, $count)
}
Write-Host ''
Write-Host '다음: npm run dev 로 확인 후 커밋하세요.' -ForegroundColor Cyan
