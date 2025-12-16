import { Timestamp } from 'firebase/firestore';
import type { ForumPost } from '@/types/forums';

export const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Best practices for pricing vintage items?',
    content:
      "I've been collecting vintage tech for years and want to start selling some pieces. What are your go-to strategies for pricing?",
    author: 'VintageCollector',
    authorId: 'user1',
    authorInitials: 'VC',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)), // 2 hours ago
    replies: 23,
    views: 456,
    likes: 15,
    isPinned: true,
    tags: ['Pricing', 'Tips'],
    category: 'Discussion',
    tradespaceId: 'ts1',
  },
  {
    id: '2',
    title: "Trade offer etiquette - what's acceptable?",
    content:
      'New to the platform and wondering what the community standards are for making trade offers...',
    author: 'NewTrader2024',
    authorId: 'user2',
    authorInitials: 'NT',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 60 * 1000)), // 5 hours ago
    replies: 34,
    views: 892,
    likes: 28,
    tags: ['Guidelines', 'Community'],
    category: 'Question',
    tradespaceId: 'ts1',
  },
  {
    id: '3',
    title: 'Successfully completed my first trade!',
    content:
      'Just wanted to share that I completed my first trade on the platform. The experience was smooth and the seller was great!',
    author: 'HappyBuyer',
    authorId: 'user3',
    authorInitials: 'HB',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 8 * 60 * 60 * 1000)), // 8 hours ago
    replies: 12,
    views: 234,
    likes: 45,
    tags: ['Success Story'],
    category: 'Story',
    tradespaceId: 'ts1',
  },
  {
    id: '4',
    title: 'How to verify product authenticity?',
    content:
      "I'm interested in purchasing some high-end items. What are the best ways to verify authenticity before completing a purchase?",
    author: 'CarefulBuyer',
    authorId: 'user4',
    authorInitials: 'CB',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)), // 1 day ago
    replies: 18,
    views: 567,
    likes: 22,
    tags: ['Safety', 'Verification'],
    category: 'Question',
    tradespaceId: 'ts1',
  },
  {
    id: '5',
    title: 'Weekly marketplace trends - November 2025',
    content:
      "Here's a breakdown of trending items and price movements this week...",
    author: 'MarketAnalyst',
    authorId: 'user5',
    authorInitials: 'MA',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)), // 2 days ago
    replies: 8,
    views: 1203,
    likes: 67,
    isPinned: true,
    tags: ['Trends', 'Analysis'],
    category: 'Discussion',
    tradespaceId: 'ts1',
  },
];
