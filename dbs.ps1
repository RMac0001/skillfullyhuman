
# MongoDB + ChromaDB Local Dev Dashboard
# Save as mongo-chroma-dashboard.ps1

function Test-Port {
    param([int]$Port)
    $used = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
    if ($used) {
        return "Listening"
    } else {
        return "Not listening"
    }
}

function Show-Status {
    $mongo = Get-Process -Name mongod -ErrorAction SilentlyContinue
    $chroma = Get-Process -Name chroma -ErrorAction SilentlyContinue

    Write-Host "`n======== STATUS ========" -ForegroundColor Cyan
    Write-Host "MongoDB:   " -NoNewline
    if ($mongo) {
        Write-Host "RUNNING" -ForegroundColor Green
    } else {
        Write-Host "NOT RUNNING" -ForegroundColor Red
    }

    Write-Host "ChromaDB:  " -NoNewline
    if ($chroma) {
        Write-Host "RUNNING" -ForegroundColor Green
    } else {
        Write-Host "NOT RUNNING" -ForegroundColor Red
    }

    Write-Host "`nPort 27017 (Mongo): " (Check-Port 27017)
    Write-Host "Port 8000  (Chroma): " (Check-Port 8000)
    Write-Host "=========================`n"
}

function Start-Mongo {
    schtasks /run /tn "MongoDB"
}

function Start-Chroma {
    schtasks /run /tn "Start ChromaDB"
}

function Stop-Mongo {
    Stop-Process -Name mongod -Force -ErrorAction SilentlyContinue
}

function Stop-Chroma {
    Stop-Process -Name chroma -Force -ErrorAction SilentlyContinue
}

while ($true) {
    Clear-Host
    Show-Status
    Write-Host "Choose an option:"
    Write-Host "[1] Start MongoDB"
    Write-Host "[2] Start ChromaDB"
    Write-Host "[3] Stop MongoDB"
    Write-Host "[4] Stop ChromaDB"
    Write-Host "[5] Refresh Status"
    Write-Host "[0] Exit"

    $choice = Read-Host "Enter selection"
    switch ($choice) {
        '1' { Start-Mongo }
        '2' { Start-Chroma }
        '3' { Stop-Mongo }
        '4' { Stop-Chroma }
        '5' { continue }
        '0' { break }
        default { Write-Host "Invalid choice."; Start-Sleep -Seconds 1 }
    }

    Start-Sleep -Seconds 2
}
