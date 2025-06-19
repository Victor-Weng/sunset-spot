# 🚀 Supabase Setup Guide for Spot App

## Quick Start Checklist

- [ ] Create Supabase account and project
- [ ] Get Project URL and API Key
- [ ] Update .env.local file
- [ ] Run database setup SQL
- [ ] Restart the app
- [ ] Test sign up/login

## Step-by-Step Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Create a new project:
   - **Organization**: Choose or create one
   - **Project name**: `spot-nature-app` (or any name you prefer)
   - **Database password**: Create a secure password
   - **Region**: Choose closest to your location

### 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **API Key** (anon/public key starting with `eyJ...`)

### 3. Update Environment Variables

Edit the `.env.local` file in your project root:

```bash
# Replace with your actual values
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Set Up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase-setup.sql` file
4. Paste into the editor and click **"Run"**

This creates:

- ✅ User profiles table
- ✅ Posts table
- ✅ Likes and comments tables
- ✅ Follow relationships
- ✅ Security policies (RLS)
- ✅ Storage bucket for images
- ✅ Automatic user profile creation

### 5. Restart Your App

```bash
# Stop the current server (Ctrl+C if running)
# Then restart:
npm start
```

### 6. Test Authentication

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Sign up"
3. Create a test account with:
   - Email: `test@example.com`
   - Password: `password123`
   - Username: `naturelover`
   - Display Name: `Nature Lover`

## Troubleshooting

### ❌ "Cannot sign up" Error

- Check that your `.env.local` file has correct Supabase URL and key
- Verify the database setup SQL ran without errors
- Restart your development server after changing `.env.local`

### ❌ "User already exists" Error

- Try a different email address
- Or reset the user in Supabase: **Authentication** → **Users** → Delete user

### ❌ "Failed to create user profile" Error

- Make sure the `users` table was created properly
- Check that the auto-profile creation trigger is working
- Verify Row Level Security policies are set up

### ❌ Images won't upload

- Confirm the `images` storage bucket exists
- Check storage policies in **Storage** → **Policies**
- Verify bucket is set to public

## Database Schema

The app uses these main tables:

- **users** - User profiles (extends auth.users)
- **posts** - Nature photos/posts with metadata
- **likes** - Post likes/reactions
- **comments** - Post comments
- **follows** - User follow relationships

## Security Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only edit their own content
- ✅ Public viewing of posts and profiles
- ✅ Secure image upload with user-specific folders

## Next Steps

Once connected, you can:

1. **Create your first post** - Upload a nature photo
2. **Explore the map** - See posts with location data
3. **Follow other users** - Build your nature community
4. **Use hashtags** - Categorize your posts (#hiking, #sunset)

## Need Help?

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the app's README.md for more details
- Ensure all environment variables are set correctly
