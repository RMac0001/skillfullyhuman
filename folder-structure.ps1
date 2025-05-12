param (
  [string]$Root = ".",
  [string]$Output = "FolderStructure.txt",
  [string[]]$Exclude = @(
    "node_modules", ".git", "*.log", "*.zip", "query.*",
    "backups", "mongo-log", "mongo-data", "chroma-data", ".next", "*.ps1"
  )
)

function Test-Exclude {
  param ([string]$Path)

  foreach ($pattern in $Exclude) {
    if ($pattern -like "*.*") {
      if ($Path -like "*$pattern") { return $true }
    } else {
      if ($Path -like "*\$pattern*" -or $Path -like "*$pattern") { return $true }
    }
  }
  return $false
}

function Write-Tree {
  param (
    [string]$BasePath,
    [string]$Indent = "",
    [bool]$IsLast = $true,
    [System.Collections.ArrayList]$Lines
  )

  $items = Get-ChildItem -LiteralPath $BasePath -Force | Sort-Object -Property { -not $_.PSIsContainer }, Name
  $items = $items | Where-Object { -not (Test-Exclude $_.FullName) }

  for ($i = 0; $i -lt $items.Count; $i++) {
    $item = $items[$i]
    $isLastItem = $i -eq ($items.Count - 1)

    $branchChar = [char]0x251C # ├
    $endChar    = [char]0x2514 # └
    $pipeChar   = [char]0x2502 # │
    $lineChar   = [char]0x2500 # ─

    $prefix = if ($isLastItem) {
      "$endChar$lineChar$lineChar "
    } else {
      "$branchChar$lineChar$lineChar "
    }

    $nextIndent = if ($isLastItem) {
      "$Indent    "
    } else {
      "$Indent$pipeChar   "
    }

    $line = "$Indent$prefix$item"
    $Lines.Add($line) | Out-Null

    if ($item.PSIsContainer) {
      Write-Tree -BasePath $item.FullName -Indent $nextIndent -IsLast $isLastItem -Lines $Lines
    }
  }
}

# Build tree
$lines = [System.Collections.ArrayList]::new()
$lines.Add("/") | Out-Null
Write-Tree -BasePath $Root -Indent "" -Lines $lines

# Output
$lines | Set-Content -Path $Output -Encoding UTF8
Write-Host "`n✅ Folder structure written to $Output" -ForegroundColor Green
