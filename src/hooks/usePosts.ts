import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Post, Comment, CreatePostData } from "../types";

// Mock demo data
const DEMO_POSTS: Post[] = [
  {
    id: "post-1",
    userId: "demo-user-id",
    title: "Sunrise at Mount Baker",
    caption:
      "Caught this incredible sunrise while hiking Mount Baker. The colors were absolutely breathtaking! #MountBaker #Sunrise #PNW #NaturePhotography",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    tags: ["MountBaker", "Sunrise", "PNW", "NaturePhotography"],
    location: {
      latitude: 48.7767,
      longitude: -121.8144,
      name: "Mount Baker, WA",
      region: "Washington",
    },
    likesCount: 142,
    commentsCount: 18,
    isLiked: false,
    createdAt: new Date("2024-01-15T06:30:00Z").toISOString(),
    updatedAt: new Date("2024-01-15T06:30:00Z").toISOString(),
    user: {
      id: "demo-user-id",
      email: "demo@spot.com",
      username: "demo",
      displayName: "Demo User",
      bio: "Nature enthusiast and photographer 🌲📸",
      profilePhoto: "",
      isPrivate: false,
      followersCount: 1247,
      followingCount: 389,
      postsCount: 52,
      createdAt: new Date("2023-01-01").toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: "post-2",
    userId: "demo-user-id",
    title: "Hidden Waterfall Discovery",
    caption:
      "Found this hidden gem after a 3-mile hike through the forest. Sometimes the best spots are the ones you have to work for! 💪🏞️",
    imageUrl:
      "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&h=600&fit=crop",
    tags: ["Waterfall", "Hiking", "HiddenGem", "Forest"],
    location: {
      latitude: 47.4979,
      longitude: -121.1013,
      name: "Snoqualmie Falls, WA",
      region: "Washington",
    },
    likesCount: 89,
    commentsCount: 12,
    isLiked: true,
    createdAt: new Date("2024-01-12T14:20:00Z").toISOString(),
    updatedAt: new Date("2024-01-12T14:20:00Z").toISOString(),
    user: {
      id: "demo-user-id",
      email: "demo@spot.com",
      username: "demo",
      displayName: "Demo User",
      bio: "Nature enthusiast and photographer 🌲📸",
      profilePhoto: "",
      isPrivate: false,
      followersCount: 1247,
      followingCount: 389,
      postsCount: 52,
      createdAt: new Date("2023-01-01").toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: "post-3",
    userId: "demo-user-id",
    title: "Alpine Lake Reflection",
    caption:
      "Perfect mirror reflection at this alpine lake. Nature's artistry at its finest! The 6-hour hike was totally worth it.",
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    tags: ["AlpineLake", "Reflection", "Mountains", "Hiking"],
    location: {
      latitude: 47.7511,
      longitude: -120.7401,
      name: "Lake Chelan, WA",
      region: "Washington",
    },
    likesCount: 256,
    commentsCount: 31,
    isLiked: false,
    createdAt: new Date("2024-01-10T16:45:00Z").toISOString(),
    updatedAt: new Date("2024-01-10T16:45:00Z").toISOString(),
    user: {
      id: "demo-user-id",
      email: "demo@spot.com",
      username: "demo",
      displayName: "Demo User",
      bio: "Nature enthusiast and photographer 🌲📸",
      profilePhoto: "",
      isPrivate: false,
      followersCount: 1247,
      followingCount: 389,
      postsCount: 52,
      createdAt: new Date("2023-01-01").toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
];

const DEMO_COMMENTS: Comment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    userId: "user-2",
    content: "Absolutely stunning! What time did you start the hike?",
    createdAt: new Date("2024-01-15T08:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-15T08:00:00Z").toISOString(),
    user: {
      id: "user-2",
      email: "sarah@example.com",
      username: "naturelover22",
      displayName: "Sarah Johnson",
      bio: "",
      profilePhoto: "",
      isPrivate: false,
      followersCount: 234,
      followingCount: 567,
      postsCount: 89,
      createdAt: new Date("2023-06-01").toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: "comment-2",
    postId: "post-1",
    userId: "user-3",
    content: "Mount Baker never disappoints! Great shot 📸",
    createdAt: new Date("2024-01-15T09:15:00Z").toISOString(),
    updatedAt: new Date("2024-01-15T09:15:00Z").toISOString(),
    user: {
      id: "user-3",
      email: "mike@example.com",
      username: "mountaineer_mike",
      displayName: "Mike Chen",
      bio: "Mountain lover",
      profilePhoto: "",
      isPrivate: false,
      followersCount: 456,
      followingCount: 234,
      postsCount: 123,
      createdAt: new Date("2023-08-01").toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
];

// Mock API functions with delays to simulate real API calls
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const useFeedPosts = () => {
  return useQuery({
    queryKey: ["posts", "feed"],
    queryFn: async () => {
      await mockDelay();
      return DEMO_POSTS;
    },
  });
};

export const useUserPosts = (username: string) => {
  return useQuery({
    queryKey: ["posts", "user", username],
    queryFn: async () => {
      await mockDelay();
      return DEMO_POSTS;
    },
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      await mockDelay();
      return DEMO_POSTS.find((post) => post.id === id) || null;
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      isLiked,
    }: {
      postId: string;
      isLiked: boolean;
    }) => {
      await mockDelay(200);
      return { success: true };
    },
    onSuccess: (_, { postId, isLiked }) => {
      // Update the post in all relevant queries
      queryClient.setQueryData(
        ["posts", "feed"],
        (oldData: Post[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked,
                  likesCount: post.likesCount + (isLiked ? 1 : -1),
                }
              : post
          );
        }
      );

      queryClient.setQueryData(
        ["posts", postId],
        (oldData: Post | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            isLiked,
            likesCount: oldData.likesCount + (isLiked ? 1 : -1),
          };
        }
      );
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: CreatePostData) => {
      await mockDelay(1000);

      const newPost: Post = {
        id: `post-${Date.now()}`,
        userId: "demo-user-id",
        title: postData.title,
        caption: postData.caption,
        imageUrl: URL.createObjectURL(postData.image), // Create temporary URL for demo
        tags: postData.tags,
        location: postData.location,
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: "demo-user-id",
          email: "demo@spot.com",
          username: "demo",
          displayName: "Demo User",
          bio: "Nature enthusiast and photographer 🌲📸",
          profilePhoto: "",
          isPrivate: false,
          followersCount: 1247,
          followingCount: 389,
          postsCount: 52,
          createdAt: new Date("2023-01-01").toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      return newPost;
    },
    onSuccess: (newPost) => {
      // Add the new post to the feed
      queryClient.setQueryData(
        ["posts", "feed"],
        (oldData: Post[] | undefined) => {
          return [newPost, ...(oldData || [])];
        }
      );

      // Add to user posts
      queryClient.setQueryData(
        ["posts", "user", "demo"],
        (oldData: Post[] | undefined) => {
          return [newPost, ...(oldData || [])];
        }
      );
    },
  });
};

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      await mockDelay();
      return DEMO_COMMENTS.filter((comment) => comment.postId === postId);
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }) => {
      await mockDelay(500);

      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        postId,
        userId: "demo-user-id",
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: "demo-user-id",
          email: "demo@spot.com",
          username: "demo",
          displayName: "Demo User",
          bio: "Nature enthusiast and photographer 🌲📸",
          profilePhoto: "",
          isPrivate: false,
          followersCount: 1247,
          followingCount: 389,
          postsCount: 52,
          createdAt: new Date("2023-01-01").toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      return newComment;
    },
    onSuccess: (newComment, { postId }) => {
      // Add comment to the comments list
      queryClient.setQueryData(
        ["comments", postId],
        (oldData: Comment[] | undefined) => {
          return [...(oldData || []), newComment];
        }
      );

      // Update comments count in post
      queryClient.setQueryData(
        ["posts", "feed"],
        (oldData: Post[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((post) =>
            post.id === postId
              ? { ...post, commentsCount: post.commentsCount + 1 }
              : post
          );
        }
      );

      queryClient.setQueryData(
        ["posts", postId],
        (oldData: Post | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, commentsCount: oldData.commentsCount + 1 };
        }
      );
    },
  });
};
