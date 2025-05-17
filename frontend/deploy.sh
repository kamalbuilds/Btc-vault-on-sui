#!/bin/bash

# BitcoinVault Pro Frontend Deployment Script

set -e

echo "🚀 Starting BitcoinVault Pro Frontend Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build the application
echo "🏗️  Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Optional: Deploy to different platforms
if [ "$1" = "vercel" ]; then
    echo "🌐 Deploying to Vercel..."
    npx vercel --prod
elif [ "$1" = "netlify" ]; then
    echo "🌐 Deploying to Netlify..."
    npx netlify deploy --prod --dir=dist
elif [ "$1" = "surge" ]; then
    echo "🌐 Deploying to Surge..."
    npx surge dist bitcoinvault-pro.surge.sh
else
    echo "📁 Build files are ready in the 'dist' directory"
    echo "   You can deploy them to any static hosting service"
    echo ""
    echo "Quick deploy options:"
    echo "  ./deploy.sh vercel   - Deploy to Vercel"
    echo "  ./deploy.sh netlify  - Deploy to Netlify"
    echo "  ./deploy.sh surge    - Deploy to Surge"
fi

echo "🎉 Deployment process completed!" 