# Download MS SQL Server JDBC Driver for NiFi

Write-Host "=================================="
Write-Host "SQL Server JDBC Driver Setup"
Write-Host "=================================="
Write-Host ""

$driverVersion = "12.4.2.0"
$driverName = "mssql-jdbc-12.4.2.jre11.jar"
$downloadUrl = "https://repo1.maven.org/maven2/com/microsoft/sqlserver/mssql-jdbc/12.4.2/$driverName"
$destinationDir = "..\extensions\drivers"
$destinationPath = "$destinationDir\$driverName"

# Create directory if not exists
if (-not (Test-Path $destinationDir)) {
    Write-Host "Creating directory: $destinationDir"
    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
}

# Check if driver already exists
if (Test-Path $destinationPath) {
    Write-Host "JDBC driver already exists at: $destinationPath" -ForegroundColor Yellow
    $response = Read-Host "Do you want to re-download? (y/n)"
    if ($response -ne "y") {
        Write-Host "Skipping download." -ForegroundColor Yellow
        exit 0
    }
}

# Download the driver
Write-Host "Downloading SQL Server JDBC Driver..."
Write-Host "URL: $downloadUrl"
Write-Host ""

try {
    # Download with progress
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $downloadUrl -OutFile $destinationPath
    $ProgressPreference = 'Continue'
    
    if (Test-Path $destinationPath) {
        $fileSize = (Get-Item $destinationPath).Length / 1MB
        Write-Host "✓ Download successful!" -ForegroundColor Green
        Write-Host "  File: $destinationPath"
        Write-Host "  Size: $([math]::Round($fileSize, 2)) MB"
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Green
        Write-Host "1. Restart NiFi container:"
        Write-Host "   docker-compose restart nifi"
        Write-Host ""
        Write-Host "2. In NiFi, configure DBCPConnectionPool with:"
        Write-Host "   Database Driver Class Name: com.microsoft.sqlserver.jdbc.SQLServerDriver"
        Write-Host "   Database Driver Location: /opt/nifi/nifi-current/extensions/drivers/$driverName"
    }
    else {
        Write-Host "Error: Download failed" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "Error downloading driver: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Download manually from:" -ForegroundColor Yellow
    Write-Host "https://learn.microsoft.com/en-us/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server"
    Write-Host ""
    Write-Host "Then copy the .jar file to: $destinationDir"
    exit 1
}
