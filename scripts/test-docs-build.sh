#!/bin/bash

echo "🧪 Testing Aran API Sentinel Documentation Build"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if Fumadocs is installed
if ! npm list fumadocs-mdx &> /dev/null; then
    echo "📦 Installing Fumadocs MDX..."
    npm install fumadocs-mdx
else
    echo "✅ Fumadocs MDX is installed"
fi

# Check if screenshots directory exists
if [ ! -d "screenshots" ]; then
    echo "📸 Creating screenshots directory..."
    mkdir -p screenshots
fi

# Check if screenshots exist
if [ ! "$(ls -A screenshots 2>/dev/null)" ]; then
    echo "⚠️  No screenshots found. You may want to run 'npm run screenshots' first."
else
    echo "✅ Screenshots found"
fi

# Test documentation build
echo "🔨 Testing documentation build..."
if npm run docs:build; then
    echo "✅ Documentation build successful!"
    
    # Check if build output exists
    if [ -d ".fumadocs" ]; then
        echo "✅ Build output directory created"
        echo "📁 Build files:"
        ls -la .fumadocs/
    else
        echo "❌ Build output directory not found"
        exit 1
    fi
else
    echo "❌ Documentation build failed!"
    exit 1
fi

echo ""
echo "🎉 Documentation build test completed successfully!"
echo ""
echo "📚 Next steps:"
echo "1. Run 'npm run docs:dev' to start development server"
echo "2. Run 'npm run screenshots' to capture UI screenshots"
echo "3. Push to main branch to trigger GitHub Pages deployment"
echo ""
echo "🌐 Documentation will be available at: https://radhi1991.github.io/aran" 