# scripts/mongo-chroma-dashboard.ps1
# Description: MongoDB + ChromaDB Local Dev Dashboard

# Get script directory and project root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$OutputsDir = Join-Path $ProjectRoot "outputs"

# Ensure outputs directory exists
if (-not (Test-Path $OutputsDir)) {
    New-Item -ItemType Directory -Path $OutputsDir -Force | Out-Null
}

# Log file for dashboard activities
$LogFile = Join-Path $OutputsDir "database-dashboard.log"

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Message"
    Add-Content -Path $LogFile -Value $logEntry
    Write-Host $logEntry
}

function Test-Port {
    param([int]$Port)
    try {
        $used = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
        if ($used) {
            return "Listening"
        } else {
            return "Not listening"
        }
    }
    catch {
        return "Error checking port"
    }
}

function Get-ServiceStatus {
    $mongo = Get-Process -Name mongod -ErrorAction SilentlyContinue
    $chroma = Get-Process -Name chroma -ErrorAction SilentlyContinue
    
    $status = @{
        MongoDB = @{
            Process = if ($mongo) { "RUNNING" } else { "NOT RUNNING" }
            Port = Test-Port 27017
            PID = if ($mongo) { $mongo.Id } else { "N/A" }
        }
        ChromaDB = @{
            Process = if ($chroma) { "RUNNING" } else { "NOT RUNNING" }
            Port = Test-Port 8000
            PID = if ($chroma) { $chroma.Id } else { "N/A" }
        }
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
    
    return $status
}

function Show-Status {
    $status = Get-ServiceStatus
    
    # Save status to JSON file
    $statusFile = Join-Path $OutputsDir "database-status.json"
    $status | ConvertTo-Json -Depth 3 | Out-File -FilePath $statusFile -Encoding UTF8
    
    Write-Host "`n======== STATUS ========" -ForegroundColor Cyan
    Write-Host "MongoDB:   " -NoNewline
    if ($status.MongoDB.Process -eq "RUNNING") {
        Write-Host $status.MongoDB.Process -ForegroundColor Green
        Write-Host "  PID: $($status.MongoDB.PID)"
    } else {
        Write-Host $status.MongoDB.Process -ForegroundColor Red
    }

    Write-Host "ChromaDB:  " -NoNewline
    if ($status.ChromaDB.Process -eq "RUNNING") {
        Write-Host $status.ChromaDB.Process -ForegroundColor Green
        Write-Host "  PID: $($status.ChromaDB.PID)"
    } else {
        Write-Host $status.ChromaDB.Process -ForegroundColor Red
    }

    Write-Host "`nPort 27017 (Mongo): $($status.MongoDB.Port)"
    Write-Host "Port 8000  (Chroma): $($status.ChromaDB.Port)"
    Write-Host "=========================`n"
    Write-Host "Status saved to: $statusFile" -ForegroundColor Yellow
}

function Start-Mongo {
    Write-Log "Attempting to start MongoDB..."
    try {
        schtasks /run /tn "MongoDB"
        Write-Log "MongoDB start command executed"
        Start-Sleep -Seconds 3
        $status = Get-ServiceStatus
        if ($status.MongoDB.Process -eq "RUNNING") {
            Write-Log "MongoDB started successfully (PID: $($status.MongoDB.PID))"
        } else {
            Write-Log "MongoDB may not have started - check manually"
        }
    }
    catch {
        Write-Log "Error starting MongoDB: $($_.Exception.Message)"
    }
}

function Start-Chroma {
    Write-Log "Attempting to start ChromaDB..."
    try {
        schtasks /run /tn "Start ChromaDB"
        Write-Log "ChromaDB start command executed"
        Start-Sleep -Seconds 3
        $status = Get-ServiceStatus
        if ($status.ChromaDB.Process -eq "RUNNING") {
            Write-Log "ChromaDB started successfully (PID: $($status.ChromaDB.PID))"
        } else {
            Write-Log "ChromaDB may not have started - check manually"
        }
    }
    catch {
        Write-Log "Error starting ChromaDB: $($_.Exception.Message)"
    }
}

function Stop-Mongo {
    Write-Log "Attempting to stop MongoDB..."
    try {
        $mongo = Get-Process -Name mongod -ErrorAction SilentlyContinue
        if ($mongo) {
            $mpid = $mongo.Id
            Stop-Process -Name mongod -Force -ErrorAction SilentlyContinue
            Write-Log "MongoDB stopped (was PID: $mpid)"
        } else {
            Write-Log "MongoDB was not running"
        }
    }
    catch {
        Write-Log "Error stopping MongoDB: $($_.Exception.Message)"
    }
}

function Stop-Chroma {
    Write-Log "Attempting to stop ChromaDB..."
    try {
        $chroma = Get-Process -Name chroma -ErrorAction SilentlyContinue
        if ($chroma) {
            $cpid = $chroma.Id
            Stop-Process -Name chroma -Force -ErrorAction SilentlyContinue
            Write-Log "ChromaDB stopped (was PID: $cpid)"
        } else {
            Write-Log "ChromaDB was not running"
        }
    }
    catch {
        Write-Log "Error stopping ChromaDB: $($_.Exception.Message)"
    }
}

# Initialize
Write-Log "Database Dashboard started"
Write-Host "Database Dashboard - Outputs saved to: $OutputsDir" -ForegroundColor Green

while ($true) {
    Clear-Host
    Write-Host "Database Dashboard - Outputs: $OutputsDir" -ForegroundColor Green
    Show-Status
    Write-Host "Choose an option:"
    Write-Host "[1] Start MongoDB"
    Write-Host "[2] Start ChromaDB"
    Write-Host "[3] Stop MongoDB"
    Write-Host "[4] Stop ChromaDB"
    Write-Host "[5] Refresh Status"
    Write-Host "[6] View Recent Logs"
    Write-Host "[0] Exit"

    $choice = Read-Host "Enter selection"
    switch ($choice) {
        '1' { Start-Mongo }
        '2' { Start-Chroma }
        '3' { Stop-Mongo }
        '4' { Stop-Chroma }
        '5' { continue }
        '6' { 
            Write-Host "`nRecent log entries:" -ForegroundColor Yellow
            if (Test-Path $LogFile) {
                Get-Content $LogFile | Select-Object -Last 10
            } else {
                Write-Host "No log file found"
            }
            Read-Host "Press Enter to continue"
        }
        '0' { 
            Write-Log "Database Dashboard exited"
            break 
        }
        default { 
            Write-Host "Invalid choice." -ForegroundColor Red
            Start-Sleep -Seconds 1 
        }
    }

    if ($choice -ne '5' -and $choice -ne '6') {
        Start-Sleep -Seconds 2
    }
}