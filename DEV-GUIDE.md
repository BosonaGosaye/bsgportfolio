# BSG Portfolio - Development Guide

## 🚀 Quick Start

### Run Everything (Recommended)
```bash
npm run dev:all
```
This starts both frontend and backend servers with auto-reload enabled.

### Run Separately
```bash
# Frontend only (port 5173)
npm run dev

# Backend only (port 5000)
cd server && npm run dev
```

## 🔄 Auto-Reload Features

### Frontend (Vite + React)
- ✅ **Hot Module Replacement (HMR)** - Instant component updates
- ✅ **CSS Hot Reload** - Tailwind changes apply instantly
- ✅ **Auto-open Browser** - Opens http://localhost:5173 automatically
- ✅ **Error Overlay** - See errors directly in the browser
- ✅ **Fast Refresh** - Preserves component state during updates

### Backend (Node.js + Express)
- ✅ **Nodemon Auto-restart** - Server restarts on file changes
- ✅ **MongoDB Connection** - Auto-reconnects on restart
- ✅ **API Hot Reload** - Route and controller changes apply instantly

## 📁 Project Structure

```
bsgportfolio/
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── context/           # React Context (Auth, Theme)
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── server/                # Backend Express app
│   ├── models/            # MongoDB models
│   ├── controllers/       # Route controllers
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── config/            # Configuration files
└── public/                # Static assets
```

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run dev:server` | Start backend dev server |
| `npm run dev:all` | Start both servers together |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🌐 Ports

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017 (or your connection string)

## 🎨 Features

### Frontend
- ⚡ Vite for blazing fast HMR
- ⚛️ React 19 with React Router
- 🎨 Tailwind CSS for styling
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🎭 Framer Motion animations
- 📝 React Markdown support

### Backend
- 🚀 Express.js REST API
- 🗄️ MongoDB with Mongoose
- 🔐 JWT authentication
- 📤 File upload with Cloudinary
- 🔄 CORS enabled
- 📊 Morgan logging

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## 🐛 Troubleshooting

### Auto-reload not working?

**Frontend:**
1. Clear browser cache (Ctrl + Shift + R)
2. Check if Vite dev server is running
3. Verify port 5173 is not in use

**Backend:**
1. Check if nodemon is installed: `cd server && npm list nodemon`
2. Verify MongoDB connection
3. Check server/.env file exists

### Port already in use?
```bash
# Windows - Kill process on port
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## 📦 Installation

```bash
# Install frontend dependencies
npm install --legacy-peer-deps

# Install backend dependencies
cd server
npm install
```

## 🚢 Deployment

```bash
# Build frontend
npm run build

# The dist/ folder contains production-ready files
# Deploy to Vercel, Netlify, or any static hosting

# Backend can be deployed to:
# - Heroku
# - Railway
# - Render
# - DigitalOcean
```

## 📚 Tech Stack

### Frontend
- React 19
- Vite
- React Router 7
- Tailwind CSS
- Framer Motion
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Cloudinary
- Multer

## 🤝 Contributing

1. Make your changes
2. Test with `npm run dev:all`
3. Run linter: `npm run lint`
4. Build: `npm run build`
5. Commit your changes

## 📄 License

ISC

---

**Happy Coding! 🎉**
