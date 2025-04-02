#!/bin/bash
set -e

echo "🔍 Running TypeScript type check..."
yarn typecheck
TS_STATUS=$?

echo "🧹 Formatting code with Prettier..."
yarn prettier:fix

echo "🔎 Running ESLint..."
yarn lint:fix
LINT_STATUS=$?

echo "🧪 Running tests..."
yarn test
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
npx vercel --prod

echo "✨ Deployment complete!" 