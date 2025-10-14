#!/bin/bash

# Create Production Deployment ZIP for AWS Amplify
# ⚠️ WARNING: This includes .env.production with LIVE keys!

echo "⚠️  WARNING: Creating PRODUCTION deployment package with LIVE keys!"
echo ""
echo "🔐 Security Reminders:"
echo "   - This zip contains LIVE Stripe keys"
echo "   - Do NOT share this file publicly"
echo "   - Do NOT upload to public repositories"
echo "   - Delete after deployment"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Cancelled"
    exit 1
fi

echo ""
echo "📦 Creating AWS Amplify PRODUCTION deployment package..."

# Set zip file name with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ZIP_NAME="memora-PRODUCTION-deploy-${TIMESTAMP}.zip"

# Create temp directory for files
TEMP_DIR="amplify-production-temp"
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

# Copy .gitignore
cp .gitignore $TEMP_DIR/ 2>/dev/null || echo "ℹ️  No .gitignore"

# ⚠️ IMPORTANT: Copy production environment file
echo "🔐 Including .env.production with LIVE keys..."
cp .env.production $TEMP_DIR/ 2>/dev/null || echo "❌ ERROR: .env.production not found!"

echo "🗑️  Excluding unnecessary files..."

# Remove files that shouldn't be deployed
rm -rf $TEMP_DIR/node_modules 2>/dev/null
rm -rf $TEMP_DIR/.env.development 2>/dev/null  # Remove dev env
rm -rf $TEMP_DIR/.env.local 2>/dev/null
rm -rf $TEMP_DIR/.git 2>/dev/null
rm -rf $TEMP_DIR/.DS_Store 2>/dev/null
rm -rf $TEMP_DIR/scripts/local-*.js 2>/dev/null
rm -rf $TEMP_DIR/.vscode 2>/dev/null
rm -rf $TEMP_DIR/.idea 2>/dev/null

echo "🗜️  Creating production zip file: $ZIP_NAME"

# Create the zip file
cd $TEMP_DIR
zip -r ../$ZIP_NAME . -q
cd ..

# Clean up temp directory
rm -rf $TEMP_DIR

# Get file size
SIZE=$(ls -lh $ZIP_NAME | awk '{print $5}')

echo ""
echo "✅ PRODUCTION deployment package created!"
echo ""
echo "📦 File: $ZIP_NAME"
echo "📊 Size: $SIZE"
echo "📍 Location: $(pwd)/$ZIP_NAME"
echo ""
echo "⚠️  SECURITY WARNINGS:"
echo "   🔐 This zip contains LIVE production Stripe keys"
echo "   🚫 Do NOT share this file"
echo "   🚫 Do NOT upload to public locations"
echo "   🚫 Do NOT commit to Git"
echo "   🗑️  Delete after deployment"
echo ""
echo "🚀 Next steps:"
echo "   1. Go to AWS Amplify Console"
echo "   2. Upload this zip file"
echo "   3. Deploy to production"
echo "   4. Set up LIVE Stripe webhook"
echo "   5. Test with a small real payment"
echo "   6. DELETE this zip file after deployment"
echo ""
echo "📚 See MANUAL_DEPLOYMENT.md for detailed instructions"
echo ""

