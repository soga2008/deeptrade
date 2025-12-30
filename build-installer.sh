#!/bin/bash

echo "========================================"
echo "Building AI Trading Application Installer"
echo "========================================"
echo ""

echo "Step 1: Building frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "Frontend build failed!"
    exit 1
fi

echo ""
echo "Step 2: Building installer..."
echo "Select your platform:"
echo "1) Windows"
echo "2) macOS"
echo "3) Linux"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        npm run electron:build:win
        ;;
    2)
        npm run electron:build:mac
        ;;
    3)
        npm run electron:build:linux
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

if [ $? -ne 0 ]; then
    echo "Installer build failed!"
    exit 1
fi

echo ""
echo "========================================"
echo "Build Complete!"
echo "========================================"
echo ""
echo "Installer location: frontend/dist-electron/"
echo ""

