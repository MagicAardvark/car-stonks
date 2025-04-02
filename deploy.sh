#!/bin/bash
set -e

# Default to dry-run (preview) mode unless --prod flag is used
PROD_DEPLOY=false
if [[ "$1" == "--prod" ]]; then
  PROD_DEPLOY=true
  echo "🚨 Running in PRODUCTION mode (deployment will update the live site)"
else
  echo "🔍 Running in preview mode (deployment will create a preview URL)"
  echo "   Use --prod flag to deploy to production"
fi

echo "🔍 Running TypeScript type check..."
yarn typecheck
TS_STATUS=$?

echo "🧹 Formatting code with Prettier..."
yarn prettier:fix

echo "🔎 Running ESLint..."
yarn lint:fix
LINT_STATUS=$?

echo "🧪 Running tests with coverage..."
yarn test:coverage
TEST_STATUS=$?

# Check if any of the checks failed
if [ $TS_STATUS -ne 0 ]; then
  echo "❌ TypeScript check failed. Fix TypeScript errors before deploying."
  exit 1
fi

if [ $LINT_STATUS -ne 0 ]; then
  echo "❌ ESLint check failed. Fix linting errors before deploying."
  exit 1
fi

if [ $TEST_STATUS -ne 0 ]; then
  echo "❌ Tests failed. Fix test errors before deploying."
  exit 1
fi

echo "✅ All checks passed! Building the application..."
yarn build
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
  echo "❌ Build failed. Fix build errors before deploying."
  exit 1
fi

echo "🚀 Deploying to Vercel..."
if [ "$PROD_DEPLOY" = true ]; then
  echo "⚠️ Deploying to PRODUCTION environment..."
  npx vercel --prod
else
  echo "🔍 Deploying to preview environment..."
  npx vercel
fi

echo "✨ Deployment complete!" 