# Hospital Attendance System

A complete MERN stack application for managing hospital staff attendance with an admin panel.

## Features

### Staff Features
- ✅ Check-in/Check-out functionality
- ✅ View personal attendance history
- ✅ Real-time attendance status
- ✅ Working hours calculation
- ✅ Late arrival detection

### Admin Features
- ✅ Dashboard with attendance statistics
- ✅ Manage staff members (CRUD operations)
- ✅ View all attendance records
- ✅ Filter attendance by date range
- ✅ Generate reports and analytics
- ✅ Mark staff as absent
- ✅ Performance indicators

## Tech Stack

- **Frontend**: React 18, TypeScript, Custom CSS, React Router
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Icons**: Lucide React

## Project Structure

```
hospital-attendance-system/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── attendanceRoutes.js
│   ├── .env.example
│   ├── Dockerfile
│   ├── vercel.json
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── .env.example
│   ├── .env.production
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vercel.json
│   └── package.json
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## 🚀 Deployment Options

### 1. Docker Deployment (Recommended)

#### Development with Docker
```bash
# Clone the repository
git clone <repository-url>
cd hospital-attendance-system

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Production with Docker
```bash
# Create production environment file
cp .env.example .env.production

# Edit .env.production with your production values
nano .env.production

# Deploy with production compose
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Manual Deployment

#### Backend Deployment

1. **Environment Setup**:
   ```bash
   cd Backend
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Install Dependencies**:
   ```bash
   npm install --production
   ```

3. **Database Setup**:
   ```bash
   # Seed the database (optional)
   npm run seed
   ```

4. **Start Production Server**:
   ```bash
   npm start
   ```

#### Frontend Deployment

1. **Environment Setup**:
   ```bash
   cd frontend
   cp .env.example .env.production
   # Edit .env.production with your API URL
   ```

2. **Build for Production**:
   ```bash
   npm install
   npm run build
   ```

3. **Serve Static Files**:
   ```bash
   npm run serve
   # Or use any static file server like nginx
   ```

### 3. Cloud Platform Deployment

#### Vercel Deployment

**Backend (Vercel)**:
```bash
cd Backend
vercel --prod
```

**Frontend (Vercel)**:
```bash
cd frontend
vercel --prod
```

#### Heroku Deployment

**Backend**:
```bash
cd Backend
heroku create hospital-attendance-api
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
git push heroku main
```

**Frontend**:
```bash
cd frontend
heroku create hospital-attendance-app
heroku buildpacks:set mars/create-react-app
heroku config:set REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
git push heroku main
```

#### AWS/DigitalOcean/Other VPS

1. **Setup Server**:
   ```bash
   # Install Node.js, MongoDB, and PM2
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs mongodb
   npm install -g pm2
   ```

2. **Deploy Backend**:
   ```bash
   # Clone and setup
   git clone <repository-url>
   cd hospital-attendance-system/Backend
   npm install --production
   
   # Start with PM2
   pm2 start server.js --name hospital-api
   pm2 startup
   pm2 save
   ```

3. **Deploy Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run build
   
   # Serve with nginx or PM2
   pm2 serve build 3000 --name hospital-frontend
   ```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/hospital_attendance
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
```

## 🔑 Demo Credentials

After running the seed script:

### Admin Account
- **Email**: admin@hospital.com
- **Password**: admin123

### Staff Accounts
- **Email**: sarah@hospital.com | **Password**: staff123
- **Email**: mike@hospital.com | **Password**: staff123
- **Email**: emily@hospital.com | **Password**: staff123

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/staff` - Get all staff
- `POST /api/users/create-staff` - Create new staff
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Attendance
- `POST /api/attendance/checkin` - Staff check-in
- `POST /api/attendance/checkout` - Staff check-out
- `GET /api/attendance/my` - Get user's attendance
- `GET /api/attendance/today` - Get today's status
- `GET /api/attendance/all` - Get all attendance (Admin)
- `GET /api/attendance/range` - Get attendance by date range (Admin)
- `GET /api/attendance/stats` - Get attendance statistics (Admin)
- `POST /api/attendance/mark-absent` - Mark staff absent (Admin)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS configuration
- Security headers
- Input validation
- Rate limiting ready
- SQL injection protection (NoSQL)

## 🚀 Performance Optimizations

- Gzip compression
- Static file caching
- Database indexing
- Connection pooling
- Lazy loading
- Code splitting ready
- Image optimization ready

## 📱 Production Checklist

### Backend
- [ ] Set strong JWT_SECRET
- [ ] Configure production MongoDB URI
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain
- [ ] Set up SSL/HTTPS
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Configure backup strategy

### Frontend
- [ ] Set production API URL
- [ ] Configure build optimizations
- [ ] Set up CDN (optional)
- [ ] Configure analytics (optional)
- [ ] Test responsive design
- [ ] Optimize images
- [ ] Configure PWA (optional)

### Infrastructure
- [ ] Set up reverse proxy (nginx)
- [ ] Configure SSL certificates
- [ ] Set up monitoring (PM2, Docker health checks)
- [ ] Configure automated backups
- [ ] Set up CI/CD pipeline
- [ ] Configure domain and DNS
- [ ] Set up error tracking

## 🛠️ Development

### Backend Development
```bash
cd Backend
npm install
npm run dev  # Starts with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm install
npm start  # Starts React development server
```

### Database Seeding
```bash
cd Backend
npm run seed  # Populates database with demo data
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Update FRONTEND_URL in backend .env
2. **Database Connection**: Check MONGO_URI format
3. **Build Errors**: Clear node_modules and reinstall
4. **Port Conflicts**: Change PORT in .env files

### Health Checks

- Backend: `GET /health`
- Frontend: `GET /health` (when using nginx config)

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request