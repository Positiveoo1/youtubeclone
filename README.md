# YouTube Clone 2026 - Full Stack Application built by Abubakrsiddik

A modern, production-ready YouTube clone built with Next.js 15, TypeScript, MongoDB, and modern UI frameworks. Features a glassmorphic design, real-time search, video streaming, comments, and user authentication.

## 🚀 Features

### Core Functionality
- ✅ **Video Streaming** - Browse trending videos from RapidAPI YouTube API
- ✅ **Search** - Real-time video search with infinite scroll
- ✅ **Video Player** - Embedded YouTube player with responsive controls
- ✅ **Comments System** - Post, view, and manage comments on videos
- ✅ **Like/Dislike** - Persistent likes and dislikes stored in MongoDB
- ✅ **Watch History** - Track and view watched videos
- ✅ **User Authentication** - Secure JWT-based login/registration
- ✅ **Responsive Design** - Mobile, tablet, and desktop layouts

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **UI Components**: Material UI, Ant Design, Bootstrap
- **Animations**: Framer Motion, Anime.js
- **Backend**: Next.js API Routes (serverless)
- **Database**: MongoDB Atlas
- **Authentication**: JWT with bcrypt
- **API**: RapidAPI YouTube138
- **State Management**: Zustand
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account
- RapidAPI account with YouTube138 API key

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd /path/to/youtubeclone
npm install
# or
yarn install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/youtube-clone?retryWrites=true&w=majority

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# RapidAPI Keys
NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
NEXT_PUBLIC_RAPIDAPI_HOST=youtube138.p.rapidapi.com

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### 3. Get RapidAPI Key

1. Go to [RapidAPI](https://rapidapi.com/)
2. Search for "YouTube138" API
3. Subscribe to the free plan
4. Copy your API key
5. Add to `.env.local`

### 4. Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database named `youtube-clone`
4. Create a database user
5. Get your connection string
6. Update `MONGODB_URI` in `.env.local`

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
youtube-clone/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── videos/               # Video endpoints
│   │   ├── comments/             # Comments endpoints
│   │   ├── likes/                # Likes endpoints
│   │   └── history/              # Watch history endpoints
│   ├── page.tsx                  # Home page
│   ├── search/page.tsx           # Search results page
│   ├── watch/[videoId]/page.tsx  # Video player page
│   └── layout.tsx                # Root layout
│
├── components/                   # React components
│   ├── Navbar.tsx                # Top navigation bar
│   ├── Sidebar.tsx               # Left sidebar navigation
│   ├── VideoCard.tsx             # Video grid card
│   ├── VideoGrid.tsx             # Video grid container
│   └── VideoSkeleton.tsx         # Loading skeleton
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication store (Zustand)
│   └── useVideo.ts               # Video store (Zustand)
│
├── lib/                          # Utility functions
│   ├── mongodb.ts                # MongoDB connection
│   ├── auth.ts                   # JWT utilities
│   ├── password.ts               # Password hashing
│   └── errors.ts                 # Error handling
│
├── models/                       # MongoDB Mongoose schemas
│   ├── User.ts                   # User model
│   ├── Video.ts                  # Video model
│   ├── Comment.ts                # Comment model
│   ├── Like.ts                   # Like model
│   └── WatchHistory.ts           # Watch history model
│
├── services/                     # Service functions
│   ├── youtube.ts                # RapidAPI YouTube service
│   └── api-client.ts             # Axios HTTP client
│
├── styles/                       # CSS styles
│   ├── globals.css               # Global styles
│   ├── navbar.css                # Navbar styles
│   ├── sidebar.css               # Sidebar styles
│   ├── video-card.css            # Video card styles
│   ├── video-grid.css            # Video grid styles
│   ├── skeleton.css              # Skeleton loader styles
│   └── watch.css                 # Watch page styles
│
├── types/                        # TypeScript types
│   └── index.ts                  # Type definitions
│
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
├── postcss.config.js             # PostCSS config
└── .env.example                  # Environment template
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  avatar: String,
  bio: String,
  verified: Boolean,
  subscriberCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Video Collection
```javascript
{
  _id: ObjectId,
  videoId: String (unique),
  title: String,
  description: String,
  thumbnail: String,
  channelId: String,
  channelName: String,
  viewCount: Number,
  likeCount: Number,
  commentCount: Number,
  uploadDate: Date,
  duration: Number,
  category: String,
  isHD: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Collection
```javascript
{
  _id: ObjectId,
  videoId: String (indexed),
  userId: ObjectId (ref: User),
  username: String,
  userAvatar: String,
  content: String,
  likes: Number,
  replies: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Like Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  videoId: String,
  type: String enum ['like', 'dislike'],
  createdAt: Date
}
```

### WatchHistory Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  videoId: String,
  watchedAt: Date,
  duration: Number,
  progress: Number,
  timestamps: { created, updated }
}
```

## 🔐 Authentication Flow

1. **Register** - POST `/api/auth/register`
   - Validates input
   - Hashes password with bcrypt
   - Creates user in MongoDB
   - Returns JWT token

2. **Login** - POST `/api/auth/login`
   - Verifies email exists
   - Compares password with hash
   - Returns JWT token

3. **Verify** - GET `/api/auth/me`
   - Requires Bearer token
   - Verifies JWT signature
   - Returns current user

## 🎬 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Videos
- `GET /api/videos/trending` - Get trending videos
- `GET /api/videos/search?q=query` - Search videos
- `GET /api/videos/[videoId]/related` - Get related videos

### Comments
- `GET /api/comments?videoId=xxx` - Get video comments
- `POST /api/comments` - Post new comment
- `DELETE /api/comments/[commentId]` - Delete comment

### Likes
- `GET /api/likes?videoId=xxx` - Get video likes
- `POST /api/likes` - Like/dislike video
- `DELETE /api/likes?videoId=xxx` - Remove like

### History
- `GET /api/history` - Get watch history
- `POST /api/history` - Record watched video

## 🎨 Styling System

- **Colors**: Dark/light mode with CSS variables
- **Animations**: Framer Motion for UI interactions
- **Layout**: Flexbox and CSS Grid
- **Typography**: System font stack with fallbacks
- **Responsive**: Mobile-first approach with breakpoints

## 🚀 Build & Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm start
# or
yarn start
```

## 📦 Deploy to Vercel

### Option 1: Using Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Add environment variables
6. Click "Deploy"

### Option 3: MongoDB Atlas & Vercel

1. Create MongoDB Atlas cluster
2. Create database user
3. Whitelist Vercel IP addresses
4. Add `MONGODB_URI` to Vercel environment variables
5. Deploy

## 🔑 Environment Variables (Production)

```env
# Production MongoDB
MONGODB_URI=mongodb+srv://prod_user:prod_password@prod-cluster.mongodb.net/youtube-clone

# Secure JWT Secret
JWT_SECRET=your_production_secret_key_min_64_chars

# RapidAPI
NEXT_PUBLIC_RAPIDAPI_KEY=your_production_key
NEXT_PUBLIC_RAPIDAPI_HOST=youtube138.p.rapidapi.com

# Production URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

NODE_ENV=production
```

## 🧪 Testing

### API Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'

# Search Videos
curl -X GET 'http://localhost:3000/api/videos/search?q=javascript' \
  -H "Content-Type: application/json"

# Get Trending
curl -X GET http://localhost:3000/api/videos/trending \
  -H "Content-Type: application/json"
```

## 📊 Performance Optimization

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **API Caching**: Response caching with proper TTL
- **Database Indexing**: Indexes on frequently queried fields
- **Skeleton Loaders**: Better perceived performance
- **Infinite Scroll**: Load data as needed

## 🔒 Security Best Practices

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT signing with HS256 algorithm
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection with Next.js
- ✅ CORS configuration
- ✅ Rate limiting ready (implement on backend)
- ✅ Environment variables for secrets

## 🐛 Known Limitations

1. Video upload not implemented (would require cloud storage)
2. Subscription system is basic (not fully implemented)
3. Notifications not yet implemented
4. Recommendations are not AI-based
5. Content moderation not implemented

## 🚀 Future Enhancements

- [ ] Video upload functionality (AWS S3/Cloudinary)
- [ ] Real-time notifications (WebSocket/Socket.io)
- [ ] Advanced recommendations algorithm
- [ ] Playlist creation and management
- [ ] Channel customization
- [ ] Live streaming support
- [ ] Advanced search filters
- [ ] Content moderation dashboard
- [ ] Analytics for creators
- [ ] Mobile app (React Native)

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Material UI Docs](https://mui.com)
- [Ant Design Docs](https://ant.design)

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, vistulaabubakrsiddik@gmail.com

---

**Built with ❤️ using Next.js 15 and Modern Web Technologies**
