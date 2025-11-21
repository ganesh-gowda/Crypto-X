#!/bin/bash
echo "Starting CryptoX Application..."
echo ""
echo "Installing dependencies (if needed)..."
npm install
echo ""
echo "Starting Backend and Frontend servers..."
echo "Backend will run on http://localhost:5000"
echo "Frontend will run on http://localhost:5173"
echo ""
npm run dev:all
