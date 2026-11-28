# Render + pack Godot effect flipbooks for the game (Windows).
# usage: powershell -File tools/godot_fx/render.ps1 [-Fx name1,name2] [-Godot path] [-Raw dir] [-NoPack]
# Each effect runs in its own Godot process (a small window opens for a few seconds) with a time limit;
# frames go to -Raw (default: %TEMP%\godot_fx_raw), pack.py turns them into assets/fx/wolf_gd/<name>.webp + meta.js.
param(
  [string[]]$Fx = @(),                     # default: every effect listed in fx_meta.json
  [string]$Godot = $env:GODOT,
  [string]$Raw = (Join-Path $env:TEMP 'godot_fx_raw'),
  [string]$Python = (Join-Path $env:LOCALAPPDATA 'Programs\Python\Python312\python.exe'),
  [int]$TimeoutSec = 90,
  [switch]$NoPack
)
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$Fx = @($Fx | ForEach-Object { $_ -split ',' } | Where-Object { $_ })   # -File passes "a,b" as one string
if ($Fx.Count -eq 0) { $Fx = @((Get-Content (Join-Path $here 'fx_meta.json') -Raw | ConvertFrom-Json).PSObject.Properties.Name | Where-Object { $_ -ne '_note' }) }
if (-not $Godot) { $Godot = 'C:\Users\Admin\Desktop\aetherfall-handoff\tools\godot\Godot_v4.7.2-stable_win64_console.exe' }
# pack options per effect (trim, anchor, meta) live in fx_meta.json
foreach ($name in $Fx) {
  $out = Join-Path $Raw $name
  if (Test-Path $out) { Get-ChildItem $out -Filter *.png | Remove-Item -Confirm:$false }
  $args = @('--path', $here, '--script', 'render.gd', '--resolution', '320x240', '--', "fx=$name", "out=$out", 'ss=2')
  $p = Start-Process -FilePath $Godot -ArgumentList $args -PassThru -NoNewWindow -RedirectStandardOutput "$Raw\$name.log" -RedirectStandardError "$Raw\$name.err"
  if (-not $p.WaitForExit($TimeoutSec * 1000)) { $p.Kill(); Write-Warning "$name timed out (killed)"; continue }
  $log = (Get-Content "$Raw\$name.log" -Raw) + (Get-Content "$Raw\$name.err" -Raw)
  if ($log -match 'SCRIPT ERROR|Parse Error|failed to load') { Write-Warning "$name failed:`n$log"; continue }
  ($log -split "`n" | Select-String 'rendered') -join ''
  if (-not $NoPack) { & $Python -X utf8 -I (Join-Path $here 'pack.py') $out $name ss=2 }
}
