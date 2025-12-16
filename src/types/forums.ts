export type ForumPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorInitials: string;
  timestamp: string;
  replies: number;
  views: number;
  likes: number;
  isPinned?: boolean;
  tags: Array<string>;
  category: string;
};
