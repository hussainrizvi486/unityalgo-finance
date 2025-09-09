start_vite_server() {
    echo -e "${GREEN}Starting Vite development server...${NC}"
    echo -e "${BLUE}Host: $HOST${NC}"
    echo -e "${BLUE}Port: $PORT${NC}"
    echo ""
    
    cd ./ui
    npm run dev &  # Add & to run in background
    cd ..
}

start_python_server() {
    echo -e "${GREEN}Starting Python server...${NC}"
    cd ./server
    source .env/bin/activate
    python3 manage.py runserver &  # Add & to run in background
    cd ..
}

# Main execution
echo -e "${GREEN}Starting Development Servers${NC}"
echo "=================================="
check_port
start_vite_server
start_python_server

wait