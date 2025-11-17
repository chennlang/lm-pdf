#!/bin/bash

echo "Building LM PDF project..."

# Clean previous builds
echo "Cleaning previous builds..."
pnpm clean

# Build component library
echo "Building component library..."
pnpm build:lib

# Build web demo
echo "Building web demo..."
pnpm build:web

echo "Build completed!"
echo "Component library: packages/easy-pdf/dist"
echo "Web demo: packages/web/dist"