#!/bin/bash
set -e

echo "Building @smart-forecast/shared package..."
cd ../shared
npm install
npm run build
echo "Shared package built successfully!"
