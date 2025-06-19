export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  profilePhoto?: string;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  title: string;
  caption: string;
  imageUrl: string;
  videoUrl?: string;
  tags: string[];
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    region?: string;
  };
  weather?: {
    temperature: number;
    condition: string;
    humidity?: number;
  };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CreatePostData {
  title: string;
  caption: string;
  image: File;
  video?: File;
  tags: string[];
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
}

export interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  profilePhoto?: File;
  isPrivate?: boolean;
}
