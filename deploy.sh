#!/bin/bash

# Hospital Attendance System Deployment Script

set -e

echo "🏥 Hospital Attendance System Deployment"
echo "========================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to deploy development environment
deploy_dev() {
    echo "🚀 Deploying Development Environment..."
    
    # Stop existing containers
    docker-compose down
    
    # Build and start services
    docker-compose up -d --build
    
    echo "✅ Development environment deployed!"
    echo "📊 Backend: http://localhost:5000"
    echo "🎨 Frontend: http://localhost:3000"
    echo "🗄️  MongoDB: localhost:27017"
}

# Function to deploy production environment
deploy_prod() {
    echo "🚀 Deploying Production Environment..."
    
    # Check if .env.production exists
    if [ ! -f .env.production ]; then
        echo "❌ .env.production file not found!"
        echo "Please create .env.production from .env.example"
        exit 1
    fi
    
    # Load production environment variables
    export $(cat .env.production | xargs)
    
    # Stop existing containers
    docker-compose -f docker-compose.prod.yml down
    
    # Build and start services
    docker-compose -f docker-compose.prod.yml up -d --build
    
    echo "✅ Production environment deployed!"
    echo "📊 Backend: http://localhost:5000"
    echo "🎨 Frontend: http://localhost:80"
}

# Function to show logs
show_logs() {
    echo "📋 Showing application logs..."
    docker-compose logs -f
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping services..."
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
    echo "✅ Services stopped!"
}

# Function to seed database
seed_database() {
    echo "🌱 Seeding database..."
    docker-compose exec backend npm run seed
    echo "✅ Database seeded with demo data!"
}

# Function to show status
show_status() {
    echo "📊 Service Status:"
    docker-compose ps
}

# Main menu
case "$1" in
    "dev")
        deploy_dev
        ;;
    "prod")
        deploy_prod
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        stop_services
        ;;
    "seed")
        seed_database
        ;;
    "status")
        show_status
        ;;
    *)
        echo "Usage: $0 {dev|prod|logs|stop|seed|status}"
        echo ""
        echo "Commands:"
        echo "  dev     - Deploy development environment"
        echo "  prod    - Deploy production environment"
        echo "  logs    - Show application logs"
        echo "  stop    - Stop all services"
        echo "  seed    - Seed database with demo data"
        echo "  status  - Show service status"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh dev     # Start development environment"
        echo "  ./deploy.sh prod    # Start production environment"
        echo "  ./deploy.sh logs    # View logs"
        echo "  ./deploy.sh stop    # Stop all services"
        exit 1
        ;;
esac