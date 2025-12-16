import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  type QueryConstraint,
  limit,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { ForumPost } from '@/types/forums';

type SortOption = 'recent' | 'popular' | 'trending' | 'unanswered';
type CategoryFilter = 'all' | 'discussion' | 'question' | 'story';

export function useForumPosts(
  tradespaceId: string,
  categoryFilter: CategoryFilter = 'all',
  sortOption: SortOption = 'recent',
) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const constraints: QueryConstraint[] = [
      where('tradespaceId', '==', tradespaceId),
    ];

    // Add category filter
    if (categoryFilter !== 'all') {
      const categoryMap = {
        discussion: 'Discussion',
        question: 'Question',
        story: 'Story',
      };
      constraints.push(
        where('category', '==', categoryMap[categoryFilter as keyof typeof categoryMap]),
      );
    }

    // Add sorting
    switch (sortOption) {
      case 'recent':
        constraints.push(orderBy('createdAt', 'desc'));
        break;
      case 'popular':
        constraints.push(orderBy('likes', 'desc'));
        break;
      case 'trending':
        constraints.push(orderBy('views', 'desc'));
        break;
      case 'unanswered':
        constraints.push(where('replies', '==', 0));
        constraints.push(orderBy('createdAt', 'desc'));
        break;
    }

    constraints.push(limit(50));

    const q = query(collection(db, 'forumPosts'), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ForumPost[];
        setPosts(postsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching forum posts:', err);
        setError(err as Error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [tradespaceId, categoryFilter, sortOption]);

  return { posts, loading, error };
}

export async function createForumPost(
  postData: Omit<ForumPost, 'id' | 'createdAt' | 'replies' | 'views' | 'likes'>,
) {
  try {
    const docRef = await addDoc(collection(db, 'forumPosts'), {
      ...postData,
      createdAt: Timestamp.now(),
      replies: 0,
      views: 0,
      likes: 0,
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating forum post:', error);
    return { success: false, error };
  }
}
