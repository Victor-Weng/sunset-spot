import { Header } from '@/components/layout/Header'
import { PostFeed } from '@/components/posts/PostFeed'

export default function Home() {
  return (
    <main>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostFeed />
      </div>
    </main>
  )
} 