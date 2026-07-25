<#
  아이폰 사진 회전 복구 + 재압축

  왜 필요한가:
    아이폰은 사진을 가로로 저장하고 "보여줄 때 90도 돌려라"는 회전 정보를
    EXIF 라는 별도 영역에 담는다. 앞서 압축할 때 이 정보가 사라져서
    사진이 눕혀진 채로 보이게 됐다.
    이번에는 회전을 픽셀에 직접 적용해 저장하므로 EXIF 없이도 바르게 보인다.

  두는 곳: 프로젝트 최상단 (package.json 과 같은 폴더)
  실행:
      cd "C:\Users\sb622\OneDrive\문서\GitHub\mobile-invitation"
      powershell -ExecutionPolicy Bypass -File .\fix-photo-rotation.ps1

  원본(백업본)에서 새로 만들기 때문에, 이미 압축된 파일을 또 압축하지 않는다.
#>

$ErrorActionPreference = 'Stop'

# 원본이 있는 곳 → 결과를 넣을 곳
$source = Join-Path $HOME 'wedding-photos-original'
$dest   = '.\src\assets\gallery'

$maxEdge = 1600   # 긴 쪽 기준. 세로 사진은 1200x1600 정도가 된다.
$quality = 82

if (-not (Test-Path .\package.json)) {
  Write-Host '프로젝트 폴더에서 실행하세요 (package.json 이 있는 곳).' -ForegroundColor Red
  exit 1
}
if (-not (Test-Path $source)) {
  Write-Host "원본 백업을 찾을 수 없습니다: $source" -ForegroundColor Red
  exit 1
}

Add-Type -AssemblyName System.Drawing

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }

# EXIF Orientation(태그 274) 값 → 실제로 어떻게 돌릴지
$rotationMap = @{
  1 = [System.Drawing.RotateFlipType]::RotateNoneFlipNone
  2 = [System.Drawing.RotateFlipType]::RotateNoneFlipX
  3 = [System.Drawing.RotateFlipType]::Rotate180FlipNone
  4 = [System.Drawing.RotateFlipType]::Rotate180FlipX
  5 = [System.Drawing.RotateFlipType]::Rotate90FlipX
  6 = [System.Drawing.RotateFlipType]::Rotate90FlipNone
  7 = [System.Drawing.RotateFlipType]::Rotate270FlipX
  8 = [System.Drawing.RotateFlipType]::Rotate270FlipNone
}

$rotated = 0
$done    = 0
$failed  = 0

Write-Host ''
Write-Host "원본: $source" -ForegroundColor DarkGray
Write-Host "대상: $dest" -ForegroundColor DarkGray
Write-Host ''

Get-ChildItem $source -File -Include *.jpg, *.jpeg, *.JPG, *.JPEG -Recurse | ForEach-Object {
  $file = $_
  $img = $null
  $bmp = $null
  $g   = $null

  try {
    $img = [System.Drawing.Image]::FromFile($file.FullName)

    # 1) EXIF 회전 정보를 읽어 픽셀에 적용
    $orientation = 1
    if ($img.PropertyIdList -contains 274) {
      $orientation = $img.GetPropertyItem(274).Value[0]
    }

    if ($rotationMap.ContainsKey([int]$orientation) -and $orientation -ne 1) {
      $img.RotateFlip($rotationMap[[int]$orientation])
      $script:rotated++
    }

    # 2) 회전 뒤의 실제 크기로 축소 비율 계산 (회전하면 가로세로가 뒤바뀐다)
    $longEdge = [Math]::Max($img.Width, $img.Height)
    $ratio = if ($longEdge -gt $maxEdge) { $maxEdge / $longEdge } else { 1 }

    $w = [int][Math]::Round($img.Width * $ratio)
    $h = [int][Math]::Round($img.Height * $ratio)

    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = 'HighQualityBicubic'
    $g.SmoothingMode     = 'HighQuality'
    $g.PixelOffsetMode   = 'HighQuality'
    $g.DrawImage($img, 0, 0, $w, $h)

    $g.Dispose();   $g = $null
    $img.Dispose(); $img = $null   # 저장 전에 원본 핸들을 놓아야 한다

    $params = New-Object System.Drawing.Imaging.EncoderParameters 1
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
      [System.Drawing.Imaging.Encoder]::Quality, [int]$quality)

    $out = Join-Path $dest $file.Name
    $tmp = "$out.tmp"
    $bmp.Save($tmp, $jpegCodec, $params)
    $bmp.Dispose(); $bmp = $null
    Move-Item $tmp $out -Force

    $mark = if ($orientation -ne 1) { '↻ 회전' } else { '      ' }
    Write-Host ("  {0}  {1}  {2}x{3}" -f $mark, $file.Name, $w, $h)
    $script:done++
  }
  catch {
    Write-Host ("  실패  {0} : {1}" -f $file.Name, $_.Exception.Message) -ForegroundColor Red
    $script:failed++
  }
  finally {
    if ($g)   { $g.Dispose() }
    if ($bmp) { $bmp.Dispose() }
    if ($img) { $img.Dispose() }
  }
}

$sizeMB = [math]::Round(((Get-ChildItem $dest -Recurse -File |
  Measure-Object Length -Sum).Sum / 1MB), 1)

Write-Host ''
Write-Host ("완료: {0}장 처리 / 회전 보정 {1}장 / 실패 {2}장" -f $done, $rotated, $failed) -ForegroundColor Green
Write-Host ("$dest 총 용량: $sizeMB MB") -ForegroundColor Green
Write-Host ''
Write-Host 'npm run dev 로 방향을 확인한 뒤 커밋하세요.' -ForegroundColor Cyan
