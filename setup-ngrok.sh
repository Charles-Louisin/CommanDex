#!/bin/bash

# Setup script for ngrok
echo "Setting up ngrok..."

# Create a local bin directory if it doesn't exist
mkdir -p ~/bin

# Download ngrok binary directly (no tar needed for latest versions)
echo "Downloading ngrok..."
cd ~/bin

# Try direct binary download
if command -v curl &> /dev/null; then
    curl -L https://bin.equinox.io/c/bNyj1mQV2kg/ngrok-v3-stable-linux-amd64 -o ngrok
elif command -v wget &> /dev/null; then
    wget https://bin.equinox.io/c/bNyj1mQV2kg/ngrok-v3-stable-linux-amd64 -O ngrok
else
    echo "Error: curl or wget not found"
    exit 1
fi

# Make it executable
chmod +x ngrok

# Check if it works
if ./ngrok version &> /dev/null; then
    echo "✅ ngrok installed successfully!"
    echo ""
    echo "To use ngrok:"
    echo "  1. Make sure your dev server is running: npm run dev"
    echo "  2. In a new terminal, run: ~/bin/ngrok http 3000"
    echo "  3. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)"
    echo "  4. Open that URL on your iPhone Safari"
else
    echo "❌ ngrok installation failed. Please download manually from:"
    echo "   https://ngrok.com/download"
    echo ""
    echo "Then extract and run: ./ngrok http 3000"
fi

