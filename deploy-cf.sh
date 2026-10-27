#!/bin/bash
set -e

export PATH="/Users/eyalballan/Desktop/Studio/Tnuva app/.bin/bin:$PATH"

echo "Deploying SELFIE 2.0 (Oranim - Prizma) to Cloudflare Pages..."
npx wrangler pages deploy . --project-name selfie-oranim --branch=main --commit-dirty=true

echo "Deployed successfully to https://selfie-oranim.pages.dev"
