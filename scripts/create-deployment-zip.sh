#!/bin/bash

# Create Deployment ZIP for AWS Amplify Manual Upload
# This script creates a zip file with all necessary files for deployment

echo "📦 Creating AWS Amplify deployment package..."

# Set zip file name with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ZIP_NAME="memora-amplify-deploy-${TIMESTAMP}.zip"

# Create temp directory for files
TEMP_DIR="amplify-deploy-temp"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

echo "📋 Copying necessary files..."

# Copy all necessary files and directories
cp -r amplify $TEMP_DIR/ 2>/dev/null || echo "⚠️  amplify/ not found"
cp -r src $TEMP_DIR/
cp -r scripts $TEMP_DIR/
cp -r netlify $TEMP_DIR/ 2>/dev/null || echo "ℹ️  netlify/ skipped (optional)"

# Copy HTML files
cp *.html $TEMP_DIR/ 2>/dev/null || echo "⚠️  No HTML files found"

# Copy config files
cp package.json $TEMP_DIR/
cp package-lock.json $TEMP_DIR/ 2>/dev/null || echo "ℹ️  No package-lock.json"
cp amplify.yml $TEMP_DIR/ 2>/dev/null || echo "ℹ️  No amplify.yml"
cp netlify.toml $TEMP_DIR/ 2>/dev/null || echo "ℹ️  No netlify.toml"

# Copy documentation
cp *.md $TEMP_DIR/ 2>/dev/null || echo "ℹ️  No .md files"

# Copy .gitignore (helps Amplify know what to ignore)
cp .gitignore $TEMP_DIR/ 2>/dev/null || echo "ℹ️  No .gitignore"

echo "🗑️  Excluding unnecessary files..."

# Remove files that shouldn't be deployed
rm -rf $TEMP_DIR/node_modules 2>/dev/null
rm -rf $TEMP_DIR/.env* 2>/dev/null
rm -rf $TEMP_DIR/.git 2>/dev/null
rm -rf $TEMP_DIR/.DS_Store 2>/dev/null
rm -rf $TEMP_DIR/scripts/local-*.js 2>/dev/null  # Remove local dev servers
rm -rf $TEMP_DIR/.vscode 2>/dev/null
rm -rf $TEMP_DIR/.idea 2>/dev/null

echo "🗜️  Creating zip file: $ZIP_NAME"

# Create the zip file
cd $TEMP_DIR
zip -r ../$ZIP_NAME . -q
cd ..

# Clean up temp directory
rm -rf $TEMP_DIR

# Get file size
SIZE=$(ls -lh $ZIP_NAME | awk '{print $5}')

echo ""
echo "✅ Deployment package created successfully!"
echo ""
echo "📦 File: $ZIP_NAME"
echo "📊 Size: $SIZE"
echo ""
echo "📍 Location: $(pwd)/$ZIP_NAME"
echo ""
echo "🚀 Next steps:"
echo "   1. Go to AWS Amplify Console"
echo "   2. Choose 'Deploy without Git provider'"
echo "   3. Upload this zip file"
echo "   4. Set environment variables"
echo "   5. Deploy!"
echo ""
echo "📚 See MANUAL_DEPLOYMENT.md for detailed instructions"
echo ""

