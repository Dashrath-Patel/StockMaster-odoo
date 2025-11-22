#!/bin/bash

# StockMaster Quick Start Script
# This script helps you set up and run both frontend and backend

set -e  # Exit on error

echo "╔═══════════════════════════════════════╗"
echo "║   StockMaster Setup & Launch          ║"
echo "╔═══════════════════════════════════════╗"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists in root
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ Frontend .env not found. Creating from example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env from .env.example${NC}"
        echo -e "${YELLOW}  Please edit .env and add your Supabase credentials${NC}"
    else
        echo -e "${RED}✗ .env.example not found!${NC}"
        exit 1
    fi
fi

# Check if backend/.env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠ Backend .env not found. Creating from example...${NC}"
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✓ Created backend/.env from backend/.env.example${NC}"
        echo -e "${YELLOW}  Please edit backend/.env and add your Supabase service_role key${NC}"
        echo -e "${YELLOW}  Get it from: Supabase Dashboard → Settings → API → service_role secret${NC}"
    else
        echo -e "${RED}✗ backend/.env.example not found!${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}Step 1: Installing frontend dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

echo ""
echo -e "${GREEN}Step 2: Installing backend dependencies...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi
cd ..

echo ""
echo -e "${GREEN}Step 3: Checking environment configuration...${NC}"

# Check if SUPABASE_SERVICE_ROLE_KEY is set in backend/.env
if grep -q "your_service_role_key_here" backend/.env; then
    echo -e "${RED}✗ Backend .env still has placeholder values!${NC}"
    echo -e "${YELLOW}  Please edit backend/.env and replace:${NC}"
    echo -e "${YELLOW}    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here${NC}"
    echo -e "${YELLOW}  with your actual service_role key from Supabase Dashboard${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment configuration looks good${NC}"

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║   Setup Complete!                     ║"
echo "╔═══════════════════════════════════════╗"
echo ""
echo -e "${GREEN}To start the application:${NC}"
echo ""
echo -e "  ${YELLOW}Terminal 1 - Backend:${NC}"
echo -e "    cd backend && npm run dev"
echo -e "    Backend will run on: ${GREEN}http://localhost:54321${NC}"
echo ""
echo -e "  ${YELLOW}Terminal 2 - Frontend:${NC}"
echo -e "    npm run dev"
echo -e "    Frontend will run on: ${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "${GREEN}Quick Commands:${NC}"
echo -e "  • Start backend:  ${YELLOW}./start-backend.sh${NC}"
echo -e "  • Start frontend: ${YELLOW}npm run dev${NC}"
echo -e "  • Run both:       ${YELLOW}npm run dev:all${NC} (if available)"
echo ""
echo -e "${GREEN}Documentation:${NC}"
echo -e "  • API Docs:       ${YELLOW}BACKEND_API.md${NC}"
echo -e "  • Migration:      ${YELLOW}MIGRATION_GUIDE.md${NC}"
echo -e "  • Architecture:   ${YELLOW}ARCHITECTURE.md${NC}"
echo -e "  • Database:       ${YELLOW}DATABASE_SCHEMA.md${NC}"
echo ""
echo -e "${GREEN}First-time setup checklist:${NC}"
echo "  1. ✓ Dependencies installed"
echo "  2. ✓ Environment files created"
echo "  3. ⚠ Run DATABASE_SCHEMA.md SQL in Supabase SQL Editor"
echo "  4. ⚠ Start backend server"
echo "  5. ⚠ Start frontend server"
echo "  6. ⚠ Create an account and test!"
echo ""
