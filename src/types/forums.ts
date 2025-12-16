import type { Timestamp } from 'firebase/firestore';

export type ForumPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorInitials: string;
  createdAt: Timestamp;
  replies: number;
  views: number;
  likes: number;
  isPinned?: boolean;
  tags: Array<string>;
  category: string;
  tradespaceId: string;
};
