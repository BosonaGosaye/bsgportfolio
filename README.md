# 🚀 BSG Portfolio

A modern, full-stack portfolio website built with React, Node.js, and MongoDB. Features a beautiful, interactive UI with dark mode support, admin dashboard for content management, and rich text editing capabilities.

![Portfolio Preview](https://via.placeholder.com/1200x600/1e40af/ffffff?text=BSG+Portfolio)

## ✨ Features

### 🎨 **Beautiful & Interactive UI**
- **Premium Design**: Vibrant gradients, micro-animations, and smooth transitions
- **Dark Mode**: Seamless light/dark theme switching
- **Responsive**: Fully responsive design for all devices
- **Framer Motion**: Smooth entrance animations and hover effects
- **Gradient Effects**: Dynamic gradient text and backgrounds

### 📝 **Rich Content Management**
- **Markdown Support**: Rich text editing with live preview for bio, projects, and blogs
- **Admin Dashboard**: Complete CMS for managing all content
- **Image Uploads**: Cloudinary integration for image and file uploads
- **Resume Upload**: PDF resume upload and management

### 🔐 **Authentication & Security**
- **JWT Authentication**: Secure admin access
- **Protected Routes**: Admin-only content management
- **Password Hashing**: bcrypt for secure password storage

### 📱 **Portfolio Sections**
- **Home**: Hero section with animated profile and bio
- **About**: Experience, education, skills, and certifications
- **Projects**: Showcase projects with images, tech stack, and links
- **Blog**: Write and publish blog posts with markdown
- **Resume**: Display and download resume
- **Contact**: Contact form with email integration

### 🌐 **Social Integration**
- GitHub, LinkedIn, Twitter, Instagram links
- Social media icons throughout the site

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Markdown** - Markdown rendering
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Helmet Async** - SEO management

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Cloudinary** - Image and file storage
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/bsgportfolio.git
cd bsgportfolio
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 3. Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the Application

**Development (Both Frontend & Backend):**
```bash
npm run dev:all
```

**Or run separately:**

Frontend:
```bash
npm run dev
```

Backend:
```bash
npm run dev:server
```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## 🚀 Deployment

### **Frontend (Netlify)**

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables if needed

3. **Important:** The `.npmrc` file with `legacy-peer-deps=true` is included to handle React 19 peer dependency conflicts.

### **Backend (Render)**

1. **Create a `render.yaml`** (already included):
   ```yaml
   services:
     - type: web
       name: bsgportfolio-backend
       env: node
       rootDir: server
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: MONGODB_URI
           sync: false
         - key: JWT_SECRET
           sync: false
         - key: CLOUDINARY_CLOUD_NAME
           sync: false
         - key: CLOUDINARY_API_KEY
           sync: false
         - key: CLOUDINARY_API_SECRET
           sync: false
   ```

2. **Deploy to Render:**
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml`
   - Add environment variables in Render dashboard
   - Deploy!

---

## 📁 Project Structure

```
bsgportfolio/
├── src/                      # Frontend source
│   ├── components/           # Reusable components
│   ├── pages/               # Page components
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── Blog.jsx
│   │   ├── Contact.jsx
│   │   └── Resume.jsx
│   ├── context/             # React context (Auth, Theme)
│   ├── services/            # API services
│   └── App.jsx              # Main app component
├── server/                   # Backend source
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   └── index.js             # Server entry point
├── public/                   # Static assets
├── .npmrc                    # NPM configuration
├── render.yaml              # Render deployment config
└── package.json             # Frontend dependencies
```

---

## 🎨 Key Features Implemented

### **Instagram Integration**
- Added Instagram to social links across the portfolio
- Backend model updated with Instagram field
- Displays on About page and Footer

### **Rich Text Editing**
- Markdown toolbar for bio fields in admin
- Live markdown rendering on public pages
- Supports **bold**, *italic*, headings, lists, and links

### **Premium Visual Polish**
- **Micro-animations**: Lift effects, scale, and translate on hover
- **Gradients**: Vibrant primary/purple gradients throughout
- **Enhanced Cards**: Project and blog cards with smooth animations
- **Interactive Navbar**: Underline animations on hover
- **Hero Section**: Gradient text and enhanced buttons
- **Contact Form**: Gradient submit button with animations

---

## 🔑 Admin Access

To access the admin dashboard:

1. Navigate to `/admin/login`
2. Use your admin credentials
3. Manage all portfolio content from the dashboard

**Admin Features:**
- Profile management
- Projects CRUD
- Blog posts CRUD
- Skills management
- Experience & Education management
- Certifications management
- Messages inbox

---

## 📝 Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Combined
- `npm run dev:all` - Run both frontend and backend concurrently

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Bosona Gosaye**

- GitHub: [@BosonaGosaye](https://github.com/BosonaGosaye)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [Your Portfolio](https://yourportfolio.com)

---

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Cloudinary](https://cloudinary.com/)

---

<div align="center">
  <p>Made with ❤️ by Bosona Gosaye</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
