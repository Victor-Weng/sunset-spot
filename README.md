# Spot - Nature Social Network

Spot is a beautiful, Instagram-style social web application designed specifically for nature lovers to share, explore, and engage with amazing outdoor experiences from around the world.

## ✨ Features

### 🔐 Authentication & User Management

- Email/password registration and login
- Secure user sessions with Supabase Auth
- User profiles with customizable bio and profile photos
- Private/public account settings

### 📸 Posts & Content Sharing

- Photo upload with title, caption, and hashtags
- Automatic geolocation detection and tagging
- Weather information integration
- Rich media support with image optimization
- Tag-based categorization (#hiking, #waterfall, etc.)

### 🗺️ Location-Based Discovery

- Interactive map view with post markers
- Location-based filtering and exploration
- Multiple map styles (streets, satellite, terrain)
- Geolocation services for current position

### 👥 Social Interactions

- Like and unlike posts
- Comment system with real-time updates
- Follow/unfollow other users
- User discovery and recommendations

### 🔍 Exploration & Discovery

- Global feed with trending content
- Explore page with filtering options
- Popular tags and trending locations
- Search functionality for posts, users, and tags

### 📱 Modern UI/UX

- Responsive design for all devices
- Beautiful, nature-inspired color scheme
- Smooth animations and transitions
- Loading states and error handling
- Infinite scroll and pagination

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Maps**: React Leaflet with OpenStreetMap
- **Backend**: Supabase (Auth, Database, Storage)
- **Icons**: Lucide React
- **Build Tool**: Create React App

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd spot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp src/env.example .env.local
   ```

   Edit `.env.local` with your Supabase credentials:

   ```env
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up Supabase Database**

   Create the following tables in your Supabase project:

   ```sql
   -- Users table (extends Supabase auth.users)
   CREATE TABLE users (
     id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
     username TEXT UNIQUE NOT NULL,
     display_name TEXT NOT NULL,
     bio TEXT,
     profile_photo TEXT,
     is_private BOOLEAN DEFAULT FALSE,
     followers_count INTEGER DEFAULT 0,
     following_count INTEGER DEFAULT 0,
     posts_count INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Posts table
   CREATE TABLE posts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
     title TEXT NOT NULL,
     caption TEXT,
     image_url TEXT NOT NULL,
     video_url TEXT,
     tags TEXT[] DEFAULT '{}',
     location JSONB,
     weather JSONB,
     likes_count INTEGER DEFAULT 0,
     comments_count INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Likes table
   CREATE TABLE likes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(post_id, user_id)
   );

   -- Comments table
   CREATE TABLE comments (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Follows table
   CREATE TABLE follows (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
     following_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(follower_id, following_id)
   );
   ```

5. **Set up Storage Bucket**

   Create a storage bucket named `images` in your Supabase project for user uploads.

6. **Start the development server**

   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Layout and navigation
│   └── Post/           # Post-related components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configs
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── App.tsx             # Main app component
```

## 🌟 Key Features Explained

### Authentication Flow

The app uses Supabase Auth with a custom React context for state management. Users can register with email/password and automatically get a profile created in the database.

### Post Creation

Users can upload photos with metadata including:

- Title and caption
- Automatic hashtag extraction
- Current location (with user permission)
- Optional weather information

### Map Integration

Interactive maps using React Leaflet show:

- Post locations with custom markers
- Multiple map tile providers
- Current location detection
- Post previews in map popups

### Real-time Features

Using Supabase's real-time capabilities:

- Live comment updates
- Like count synchronization
- New post notifications

## 🔧 Customization

### Theming

The app uses Tailwind CSS with custom color schemes defined in `tailwind.config.js`. Modify the theme colors to match your brand:

```js
theme: {
  extend: {
    colors: {
      primary: { /* your primary colors */ },
      nature: { /* your nature-themed colors */ }
    }
  }
}
```

### Adding Features

The modular architecture makes it easy to add new features:

- Create new hooks in `src/hooks/`
- Add new page components in `src/pages/`
- Extend the API calls in existing hooks
- Update TypeScript types in `src/types/`

## 🚀 Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from Instagram and nature photography communities
- Built with modern React best practices
- Powered by Supabase for backend services
- Maps provided by OpenStreetMap contributors

---

**Happy nature sharing! 🌲📸**
