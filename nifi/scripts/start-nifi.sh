#!/bin/bash

# NiFi Quick Start Script for MuTraPro
# This script helps you quickly start and verify NiFi setup

echo "=================================="
echo "NiFi Quick Start for MuTraPro"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if Docker is running
check_docker() {
    echo "Checking Docker status..."
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker is running${NC}"
}

# Function to check if docker-compose file exists
check_compose_file() {
    echo "Checking docker-compose.yml..."
    if [ ! -f "docker-compose.yml" ]; then
        echo -e "${RED}Error: docker-compose.yml not found!${NC}"
        echo "Please run this script from the project root directory."
        exit 1
    fi
    echo -e "${GREEN}✓ docker-compose.yml found${NC}"
}

# Function to start services
start_services() {
    echo ""
    echo "Starting all services (including NiFi)..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Services started successfully${NC}"
    else
        echo -e "${RED}Error starting services${NC}"
        exit 1
    fi
}

# Function to wait for NiFi to be ready
wait_for_nifi() {
    echo ""
    echo "Waiting for NiFi to start (this may take 1-2 minutes)..."
    
    max_attempts=60
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker logs nifi 2>&1 | grep -q "NiFi has started"; then
            echo -e "${GREEN}✓ NiFi is ready!${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${YELLOW}NiFi is taking longer than expected. Please check 'docker logs nifi'${NC}"
    return 1
}

# Function to display service status
show_status() {
    echo ""
    echo "=================================="
    echo "Service Status"
    echo "=================================="
    docker-compose ps
}

# Function to display access information
show_access_info() {
    echo ""
    echo "=================================="
    echo "Access Information"
    echo "=================================="
    echo ""
    echo -e "${GREEN}NiFi Web UI:${NC}"
    echo "  URL:      http://localhost:8080/nifi"
    echo "  Username: admin"
    echo "  Password: AdminPass123456"
    echo ""
    echo -e "${GREEN}RabbitMQ Management:${NC}"
    echo "  URL:      http://localhost:15672"
    echo "  Username: guest"
    echo "  Password: guest"
    echo ""
    echo -e "${GREEN}API Gateway:${NC}"
    echo "  URL:      http://localhost:8000"
    echo ""
}

# Function to show useful commands
show_commands() {
    echo "=================================="
    echo "Useful Commands"
    echo "=================================="
    echo ""
    echo "View NiFi logs:"
    echo "  docker logs nifi"
    echo ""
    echo "View all service logs:"
    echo "  docker-compose logs -f"
    echo ""
    echo "Stop all services:"
    echo "  docker-compose down"
    echo ""
    echo "Restart NiFi:"
    echo "  docker-compose restart nifi"
    echo ""
    echo "Check NiFi status:"
    echo "  docker ps | grep nifi"
    echo ""
}

# Main execution
main() {
    check_docker
    check_compose_file
    start_services
    wait_for_nifi
    show_status
    show_access_info
    show_commands
    
    echo ""
    echo -e "${GREEN}Setup complete! You can now access NiFi at http://localhost:8080/nifi${NC}"
}

# Run main function
main
