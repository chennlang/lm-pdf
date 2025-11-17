#!/bin/bash

echo "=== LM PDF Project Test ==="

echo "1. Checking project structure..."
if [ -d "backend" ] && [ -d "packages" ]; then
    echo "✅ Project structure is correct"
else
    echo "❌ Project structure is missing"
    exit 1
fi

echo "2. Checking backend files..."
if [ -f "backend/main.py" ] && [ -f "backend/requirements.txt" ]; then
    echo "✅ Backend files exist"
else
    echo "❌ Backend files are missing"
    exit 1
fi

echo "3. Checking frontend packages..."
if [ -d "packages/easy-pdf" ] && [ -d "packages/web" ]; then
    echo "✅ Frontend packages exist"
else
    echo "❌ Frontend packages are missing"
    exit 1
fi

echo "4. Checking package.json files..."
if [ -f "package.json" ] && [ -f "packages/easy-pdf/package.json" ] && [ -f "packages/web/package.json" ]; then
    echo "✅ Package.json files exist"
else
    echo "❌ Package.json files are missing"
    exit 1
fi

echo "5. Checking pnpm workspace..."
if [ -f "pnpm-workspace.yaml" ]; then
    echo "✅ PNPM workspace configured"
else
    echo "❌ PNPM workspace not configured"
    exit 1
fi

echo "6. Checking TypeScript configs..."
if [ -f "packages/easy-pdf/tsconfig.json" ] && [ -f "packages/web/tsconfig.json" ]; then
    echo "✅ TypeScript configs exist"
else
    echo "❌ TypeScript configs are missing"
    exit 1
fi

echo "7. Checking core component files..."
if [ -f "packages/easy-pdf/src/index.tsx" ] && [ -f "packages/easy-pdf/src/types.ts" ]; then
    echo "✅ Core component files exist"
else
    echo "❌ Core component files are missing"
    exit 1
fi

echo ""
echo "🎉 All checks passed! Project structure is ready!"
echo ""
echo "Next steps:"
echo "1. Install dependencies: pnpm install"
echo "2. Setup backend: cd backend && python -m venv venv && pip install -r requirements.txt"
echo "3. Start development: ./scripts/dev.sh"
echo ""
echo "Or run manually:"
echo "- Backend: cd backend && python main.py"
echo "- Frontend: pnpm dev"