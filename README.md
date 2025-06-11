# Sunset Social

A social media platform for sharing and discovering beautiful sunset moments around the world.

## Tech Stack

- **Frontend**: React (with Context + Hooks), TypeScript, Next.js 15 (App Router)
- **Backend**: PostgreSQL (Prisma ORM), Node.js (Next API Routes)
- **Authentication**: Email/password with JWT
- **Styling**: TailwindCSS
- **Mapping**: React Leaflet
- **Storage**: Azure Blob Storage
- **Hosting**: Vercel + Azure

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # Reusable React components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── posts/            # Post-related components
│   ├── map/              # Map-related components
│   └── auth/             # Authentication components
├── lib/                  # Core functionality
│   ├── prisma/          # Prisma client and utilities
│   ├── auth/            # Authentication utilities
│   └── api/             # API utilities
├── hooks/               # Custom React hooks
├── context/            # React Context providers
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sunset_social"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
OPENWEATHER_API_KEY="your-api-key"
AZURE_STORAGE_CONNECTION_STRING="your-connection-string"
```

## Features

- User authentication (signup/login)
- Sunset photo sharing
- Interactive map with photo locations
- Weather and sunset time information
- User profiles
- Like and comment system
- ML-powered sunset detection (future)

## Development

- All components are documented with JSDoc/TypeScript comments
- Follow the established folder structure
- Use TypeScript for type safety
- Write tests for new features
- Follow the Git commit message convention

## License

MIT 