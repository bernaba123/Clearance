# AASTU Student Clearance Management System

A comprehensive web-based student clearance management system designed for Addis Ababa Science and Technology University (AASTU). This system streamlines the clearance process for students, making it easier for both students and administrative staff to manage clearance requirements and approvals.

## 🚀 Features

- **Student Authentication & Profile Management**
- **Clearance Request & Tracking System**
- **Department-wise Clearance Management**
- **Administrative Dashboard**
- **News & Announcements**
- **Statistics & Reporting**
- **PDF Generation for Clearance Documents**
- **Role-based Access Control**
- **Real-time Status Updates**

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** & **CORS** for security
- **Express Rate Limiting** for API protection
- **jsPDF** for document generation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/bernaba123/aastu-clearance-system.git
cd aastu-clearance-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aastu-clearance
JWT_SECRET=your-super-secure-jwt-secret
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Database Setup
```bash
cd backend
npm run seed  # Optional: Seed the database with initial data
```

## 🚀 Running the Application

### Development Mode

**Start the backend server:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Start the frontend development server:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

### Production Mode

**Build the frontend:**
```bash
cd frontend
npm run build
```

**Start the backend in production:**
```bash
cd backend
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Clearance Management
- `GET /api/clearance` - Get clearance requests
- `POST /api/clearance` - Create new clearance request
- `PUT /api/clearance/:id` - Update clearance status

### Administrative
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/stats` - System statistics
- `GET /api/news` - News and announcements

### Health Check
- `GET /api/health` - Server health status

## 🏗️ Project Structure

```
aastu-clearance-system/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── scripts/          # Database scripts
│   └── server.js         # Express server setup
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   └── types/        # TypeScript type definitions
│   ├── public/           # Static assets
│   └── index.html        # HTML template
├── package.json          # Root package.json
└── README.md
```

## 🔒 Security Features

- **JWT-based Authentication**
- **Password Hashing** with bcryptjs
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **Input Validation** with express-validator

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Ensure code passes ESLint checks
- Write meaningful variable and function names
- Add comments for complex logic

## 📝 Scripts

### Root Directory
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial data

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your `MONGODB_URI` in the `.env` file

2. **CORS Issues**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check if both frontend and backend are running

3. **Authentication Issues**
   - Ensure `JWT_SECRET` is set in `.env`
   - Clear browser localStorage if needed

## 📄 License

This project is licensed under AASTU.
All Rights Reserved


## 👥 Team

This project was developed for Addis Ababa Science and Technology University to modernize their student clearance process.

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---
