#!/bin/bash

# Color definitions (assuming these are defined earlier in your script)
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color


MIGRATE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --migrate)
            MIGRATE=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--migrate]"
            exit 1
            ;;
    esac
done

run_migrations() {
    echo -e "${YELLOW}Running Django migrations...${NC}"
    cd ./server
    source .env/bin/activate
    
    echo -e "${BLUE}Making migrations...${NC}"
    python3 manage.py makemigrations
    
    echo -e "${BLUE}Applying migrations...${NC}"
    python3 manage.py migrate
    
    cd ..
    echo -e "${GREEN}Migrations completed!${NC}"
    echo ""
}

start_vite_server() {
    echo -e "${GREEN}Starting Vite development server...${NC}"
    echo -e "${BLUE}Host: $HOST${NC}"
    echo -e "${BLUE}Port: $PORT${NC}"
    echo ""
    cd ./ui
    npm run dev & # Add & to run in background
    cd ..
}

start_python_server() {
    echo -e "${GREEN}Starting Python server...${NC}"
    cd ./server
    source .env/bin/activate
    python3 manage.py runserver & # Add & to run in background
    cd ..
}

echo -e "${GREEN}Starting Development Servers${NC}"
echo "=================================="

# Run migrations if flag is set
if [ "$MIGRATE" = true ]; then
    run_migrations
fi

check_port
start_vite_server
start_python_server
wait