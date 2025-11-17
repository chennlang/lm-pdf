#!/bin/bash

echo "=== LM PDF Development Environment ==="

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Check if backend dependencies are installed
if [ ! -d "backend/venv" ] && [ ! -d "backend/.venv" ]; then
    echo "Setting up backend virtual environment..."
    cd backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Start backend server
echo "Starting backend server..."
cd backend
source venv/bin/activate 2>/dev/null || source .venv/bin/activate 2>/dev/null || true
python main.py &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 3

# Start frontend development server
echo "Starting frontend development server..."
cd ..
pnpm dev &
FRONTEND_PID=$!

# Wait a bit for frontend to start and get the port
sleep 3

# Get the actual frontend port (might be 3000 or 3001 if 3000 is occupied)
FRONTEND_PORT=$(curl -s http://localhost:3000 > /dev/null 2>&1 && echo "3000" || echo "3001")

# Function to cleanup processes
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Development servers stopped."
    exit
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo ""
echo "🚀 Development servers started!"
echo "📡 Backend API: http://localhost:8000"
echo "🌐 Frontend:   http://localhost:$FRONTEND_PORT"
echo "📚 API Docs:   http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for processes
wait