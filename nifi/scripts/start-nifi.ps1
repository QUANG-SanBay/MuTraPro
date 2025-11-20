# NiFi Quick Start Script for MuTraPro (Windows PowerShell)
# This script helps you quickly start and verify NiFi setup

Write-Host "=================================="
Write-Host "NiFi Quick Start for MuTraPro"
Write-Host "=================================="
Write-Host ""

# Function to check if Docker is running
function Check-Docker {
    Write-Host "Checking Docker status..."
    try {
        docker info | Out-Null
        Write-Host "✓ Docker is running" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Error: Docker is not running. Please start Docker first." -ForegroundColor Red
        return $false
    }
}

# Function to check if docker-compose file exists
function Check-ComposeFile {
    Write-Host "Checking docker-compose.yml..."
    if (Test-Path "docker-compose.yml") {
        Write-Host "✓ docker-compose.yml found" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "Error: docker-compose.yml not found!" -ForegroundColor Red
        Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
        return $false
    }
}

# Function to start services
function Start-Services {
    Write-Host ""
    Write-Host "Starting all services (including NiFi)..."
    docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Services started successfully" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "Error starting services" -ForegroundColor Red
        return $false
    }
}

# Function to wait for NiFi to be ready
function Wait-ForNiFi {
    Write-Host ""
    Write-Host "Waiting for NiFi to start (this may take 1-2 minutes)..."
    
    $maxAttempts = 60
    $attempt = 0
    
    while ($attempt -lt $maxAttempts) {
        $logs = docker logs nifi 2>&1 | Out-String
        if ($logs -match "NiFi has started") {
            Write-Host "✓ NiFi is ready!" -ForegroundColor Green
            return $true
        }
        
        Write-Host -NoNewline "."
        Start-Sleep -Seconds 2
        $attempt++
    }
    
    Write-Host ""
    Write-Host "NiFi is taking longer than expected. Please check 'docker logs nifi'" -ForegroundColor Yellow
    return $false
}

# Function to display service status
function Show-Status {
    Write-Host ""
    Write-Host "=================================="
    Write-Host "Service Status"
    Write-Host "=================================="
    docker-compose ps
}

# Function to display access information
function Show-AccessInfo {
    Write-Host ""
    Write-Host "=================================="
    Write-Host "Access Information"
    Write-Host "=================================="
    Write-Host ""
    Write-Host "NiFi Web UI:" -ForegroundColor Green
    Write-Host "  URL:      http://localhost:8080/nifi"
    Write-Host "  Username: admin"
    Write-Host "  Password: AdminPass123456"
    Write-Host ""
    Write-Host "RabbitMQ Management:" -ForegroundColor Green
    Write-Host "  URL:      http://localhost:15672"
    Write-Host "  Username: guest"
    Write-Host "  Password: guest"
    Write-Host ""
    Write-Host "API Gateway:" -ForegroundColor Green
    Write-Host "  URL:      http://localhost:8000"
    Write-Host ""
}

# Function to show useful commands
function Show-Commands {
    Write-Host "=================================="
    Write-Host "Useful Commands"
    Write-Host "=================================="
    Write-Host ""
    Write-Host "View NiFi logs:"
    Write-Host "  docker logs nifi"
    Write-Host ""
    Write-Host "View all service logs:"
    Write-Host "  docker-compose logs -f"
    Write-Host ""
    Write-Host "Stop all services:"
    Write-Host "  docker-compose down"
    Write-Host ""
    Write-Host "Restart NiFi:"
    Write-Host "  docker-compose restart nifi"
    Write-Host ""
    Write-Host "Check NiFi status:"
    Write-Host "  docker ps | Select-String nifi"
    Write-Host ""
}

# Main execution
function Main {
    if (-not (Check-Docker)) { exit 1 }
    if (-not (Check-ComposeFile)) { exit 1 }
    if (-not (Start-Services)) { exit 1 }
    
    Wait-ForNiFi | Out-Null
    Show-Status
    Show-AccessInfo
    Show-Commands
    
    Write-Host ""
    Write-Host "Setup complete! You can now access NiFi at http://localhost:8080/nifi" -ForegroundColor Green
}

# Run main function
Main
