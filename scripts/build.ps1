# Construit les paquets des boutiques dans dist/ à partir des sources du dépôt.
#   dist/patreon-live-chat-<version>-firefox.zip   manifeste tel quel (background.scripts)
#   dist/chromium/                                 dossier à charger non empaqueté dans Chrome, Edge ou Opera
#   dist/patreon-live-chat-<version>-chromium.zip  même contenu, pour Chrome Web Store, Edge Add-ons et Opera Addons
# Usage : powershell -ExecutionPolicy Bypass -File scripts/build.ps1

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root 'dist'
$include = @(
  'manifest.json', 'LICENSE', 'PRIVACY.md', 'README.md',
  'background', 'content', 'icons', 'options', '_locales'
)
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Get-Files {
  foreach ($item in $include) {
    $path = Join-Path $root $item
    if (Test-Path $path -PathType Container) {
      Get-ChildItem $path -Recurse -File
    } else {
      Get-Item $path
    }
  }
}

function Get-Relative([string]$fullName) {
  $fullName.Substring($root.Length + 1).Replace('\', '/')
}

# Les zips des boutiques veulent des chemins avec des barres obliques ; Compress-Archive met des antislashs.
function New-Zip([string]$zipPath, [hashtable]$overrides) {
  if (Test-Path $zipPath) { Remove-Item $zipPath }
  $zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
  try {
    foreach ($file in Get-Files) {
      $name = Get-Relative $file.FullName
      $entry = $zip.CreateEntry($name, 'Optimal')
      $stream = $entry.Open()
      try {
        if ($overrides.ContainsKey($name)) {
          $bytes = $utf8.GetBytes($overrides[$name])
        } else {
          $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        }
        $stream.Write($bytes, 0, $bytes.Length)
      } finally {
        $stream.Dispose()
      }
    }
  } finally {
    $zip.Dispose()
  }
}

$manifestText = [System.IO.File]::ReadAllText((Join-Path $root 'manifest.json'), $utf8)
$manifest = $manifestText | ConvertFrom-Json
$version = $manifest.version

# Chromium refuse background.scripts et ignore browser_specific_settings.
$chromium = $manifestText | ConvertFrom-Json
$chromium.background = [pscustomobject]@{ service_worker = 'background/service-worker.js' }
$chromium.PSObject.Properties.Remove('browser_specific_settings')
$chromium | Add-Member -NotePropertyName 'minimum_chrome_version' -NotePropertyValue '111'
$chromiumText = $chromium | ConvertTo-Json -Depth 20

New-Item -ItemType Directory -Force $dist | Out-Null

# Un zip déjà envoyé à une boutique ne doit plus changer : on monte la version à la place.
$firefoxZip = Join-Path $dist "patreon-live-chat-$version-firefox.zip"
if (Test-Path $firefoxZip) {
  Write-Host "Firefox  : $firefoxZip existe déjà, conservé tel quel"
} else {
  New-Zip $firefoxZip @{}
  Write-Host "Firefox  : $firefoxZip"
}

$chromiumDir = Join-Path $dist 'chromium'
if (Test-Path $chromiumDir) { Remove-Item $chromiumDir -Recurse -Force }
foreach ($file in Get-Files) {
  $target = Join-Path $chromiumDir (Get-Relative $file.FullName)
  New-Item -ItemType Directory -Force (Split-Path -Parent $target) | Out-Null
  Copy-Item $file.FullName $target
}
[System.IO.File]::WriteAllText((Join-Path $chromiumDir 'manifest.json'), $chromiumText, $utf8)

$chromiumZip = Join-Path $dist "patreon-live-chat-$version-chromium.zip"
New-Zip $chromiumZip @{ 'manifest.json' = $chromiumText }

Write-Host "Chromium : $chromiumZip"
Write-Host "Dossier à charger dans Chrome, Edge ou Opera : $chromiumDir"
