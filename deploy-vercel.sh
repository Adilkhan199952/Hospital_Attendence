#!/bin/bash

# Hospital Attendance System - Vercel Deployment Script
# This script helps deploy the application to Vercel

echo "🏥 Hospital Attendance System - Vercel Deployment"
echo "=================================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI is not installed"
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed successfully"
fi

echo ""
echo "Choose deployment option:"
echo "1. Deploy Frontend only"
echo "2. Deploy Backend only"
echo "3. Deploy Both (Frontend + Backend)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying Frontend to Vercel..."
        cd frontend
        vercel --prod
        echo "✅ Frontend deployment complete!"
        ;;
    2)
        echo ""
        echo "🚀 Deploying Backend to Vercel..."
        cd Backend
        vercel --prod
        echo "✅ Backend deployment complete!"
        echo ""
        echo "⚠️  Important: Update frontend REACT_APP_API_URL with new backend URL"
        ;;
    3)
        echo ""
        echo "🚀 Deploying Backend to Vercel..."
        cd Backend
        vercel --prod
        BACKEND_URL=$(vercel --prod 2>&1 | grep -o 'https://[^ ]*')
        cd ..
        
        echo ""
        echo "🚀 Deploying Frontend to Vercel..."
        cd frontend
        vercel --prod
        
        echo ""
        echo "✅ Both deployments complete!"
        echo ""
        echo "📝 Next Steps:"
        echo "1. Update frontend environment variable REACT_APP_API_URL"
        echo "2. Redeploy frontend with updated backend URL"
        echo "3. Test the application"
        ;;
    *)
        echo "❌ Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📋 Post-Deployment Checklist:"
echo "  ✓ Visit your Vercel dashboard to see deployment status"
echo "  ✓ Check deployment logs for any errors"
echo "  ✓ Test the application with demo credentials"
echo "  ✓ Verify API connectivity"
echo ""
echo "Demo Credentials:"
echo "  Admin: admin@hospital.com / admin123"
echo "  Staff: sarah@hospital.com / staff123"
echo ""
