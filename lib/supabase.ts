import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database table names
export const TABLES = {
  USERS: "users",
  POSTS: "posts",
  COMMENTS: "comments",
  LIKES: "likes",
  FOLLOWS: "follows",
} as const;
