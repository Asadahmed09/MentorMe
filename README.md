# MentorMe Platform 🎓

A comprehensive **Student Mentorship Platform** SaaS application built with the MERN stack. Connect struggling students with top-performing mentors for academic success.

![MentorMe](https://img.shields.io/badge/MentorMe-Platform-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Postgre](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

## 🌟 Features

### For Students

- 🔍 **Find Mentors** - Browse and search verified mentors by subject, GPA, and ratings
- 📅 **Book Sessions** - Schedule mentorship sessions with ease
- 💬 **Real-time Chat** - Communicate with mentors through live messaging
- ⭐ **Rate & Review** - Provide feedback on mentorship quality
- 📊 **Track Progress** - Monitor your learning journey

### For Mentors

- 📝 **Apply to Become a Mentor** - Showcase your expertise and help others
- 📆 **Manage Sessions** - Accept, schedule, and conduct sessions
- 💰 **Set Your Rate** - Free or paid mentorship options
- 📈 **Build Reputation** - Earn ratings and grow your profile

### For Admins

- 👥 **User Management** - Oversee all platform users
- ✅ **Mentor Approval** - Review and approve mentor applications
- 📊 **Analytics Dashboard** - Monitor platform statistics
- 🛡️ **Content Moderation** - Ensure platform quality

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Query** - Server state
- **React Router v6** - Routing
- **Framer Motion** - Animations
- **Socket.io-client** - Real-time communication
- **React Hook Form** - Form handling
- **Heroicons** - Icons

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Postgre SQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Validation
- **Nodemailer** - Emails

## 📂 Project Structure

```
MentorMe Platform/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── auth/       # Auth-related components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── mentors/    # Mentor components
│   │   │   └── ui/         # Base UI components
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin pages
│   │   │   ├── auth/       # Auth pages
│   │   │   ├── dashboard/  # Dashboard pages
│   │   │   └── mentors/    # Mentor pages
│   │   ├── services/       # API services
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Helper functions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── socket/         # Socket.io handlers
│   │   ├── utils/          # Utilities
│   │   ├── scripts/        # DB scripts
│   │   └── index.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── package.json            # Root package.json
├── .env.example            # Environment template
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/mentorme-platform.git
   cd mentorme-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   # Copy the example env file
   cp .env.example .env

   # Edit .env with your configuration
   ```

4. **Set up MongoDB**
   - Create a MongoDB database
   - Update the `MONGODB_URI` in `.env`

5. **Seed the database (optional)**

   ```bash
   npm run seed
   ```

6. **Start development servers**

   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

### Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/mentorme

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key
JWT_REFRESH_EXPIRE=30d

# Client
CLIENT_URL=http://localhost:5173

# Email (Optional)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
SMTP_FROM=noreply@mentorme.com

# File Upload (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Register new user    |
| POST   | `/api/auth/login`    | User login           |
| POST   | `/api/auth/logout`   | User logout          |
| GET    | `/api/auth/me`       | Get current user     |
| POST   | `/api/auth/refresh`  | Refresh access token |

### Mentors

| Method | Endpoint                       | Description                |
| ------ | ------------------------------ | -------------------------- |
| GET    | `/api/mentors`                 | Get all mentors            |
| GET    | `/api/mentors/:id`             | Get mentor by ID           |
| POST   | `/api/mentors/apply`           | Apply as mentor            |
| GET    | `/api/mentors/top`             | Get top-rated mentors      |
| GET    | `/api/mentors/recommendations` | Get mentor recommendations |

### Sessions

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| GET    | `/api/sessions`            | Get user's sessions |
| POST   | `/api/sessions`            | Book a session      |
| GET    | `/api/sessions/:id`        | Get session details |
| PUT    | `/api/sessions/:id`        | Update session      |
| POST   | `/api/sessions/:id/cancel` | Cancel session      |

### Chat

| Method | Endpoint                 | Description      |
| ------ | ------------------------ | ---------------- |
| GET    | `/api/chat`              | Get user's chats |
| POST   | `/api/chat`              | Create/get chat  |
| GET    | `/api/chat/:id/messages` | Get messages     |
| POST   | `/api/chat/:id/messages` | Send message     |

### Subjects

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/subjects`     | Get all subjects  |
| GET    | `/api/subjects/:id` | Get subject by ID |

### Ratings

| Method | Endpoint                  | Description        |
| ------ | ------------------------- | ------------------ |
| POST   | `/api/ratings`            | Submit rating      |
| GET    | `/api/ratings/mentor/:id` | Get mentor ratings |

### Admin

| Method | Endpoint                         | Description         |
| ------ | -------------------------------- | ------------------- |
| GET    | `/api/admin/stats`               | Get platform stats  |
| GET    | `/api/admin/users`               | Get all users       |
| GET    | `/api/admin/mentors/pending`     | Get pending mentors |
| PUT    | `/api/admin/mentors/:id/approve` | Approve mentor      |
| PUT    | `/api/admin/mentors/:id/reject`  | Reject mentor       |

## 🔐 Demo Accounts

| Role    | Email                | Password    |
| ------- | -------------------- | ----------- |
| Admin   | admin@mentorme.com   | Admin@123   |
| Mentor  | mentor@mentorme.com  | Mentor@123  |
| Student | student@mentorme.com | Student@123 |

## 📱 Screenshots

### Homepage

Modern landing page with hero section, features, and top mentors.

### Mentor Listing

Browse and filter mentors by subject, GPA, and ratings.

### Dashboard

User dashboard with upcoming sessions and quick actions.

### Real-time Chat

Live messaging between students and mentors.

## 🧪 Scripts

```bash
# Install all dependencies
npm install

# Run development (client + server)
npm run dev

# Run client only
npm run client

# Run server only
npm run server

# Build for production
npm run build

# Seed database
npm run seed

# Run tests
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- FAST University for the inspiration
- All contributors and testers
- Open source community

---

Built with ❤️ by the MentorMe Team
