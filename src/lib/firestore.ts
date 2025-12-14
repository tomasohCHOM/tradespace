import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export async function createUserProfile(
  uid: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
  },
) {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);

  // Only create the profile if it doesn't already exist
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      ...data,
      joinedTradespaces: [], // Initialize empty array for joined tradespaces
      createdAt: new Date().toISOString(),
    });
  }
}

/**
 * Join a tradespace
 * - Adds tradespace ID to user's joinedTradespaces array
 * - Increments the tradespace's memberCount
 */
export async function joinTradespace(userId: string, tradespaceId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const tradespaceRef = doc(db, 'tradespaces', tradespaceId);

    // Add tradespace to user's joined list
    await updateDoc(userRef, {
      joinedTradespaces: arrayUnion(tradespaceId),
    });

    // Increment member count
    await updateDoc(tradespaceRef, {
      memberCount: increment(1),
    });

    return { success: true };
  } catch (error) {
    console.error('Error joining tradespace:', error);
    throw error;
  }
}

/**
 * Leave a tradespace
 * - Removes tradespace ID from user's joinedTradespaces array
 * - Decrements the tradespace's memberCount
 */
export async function leaveTradespace(userId: string, tradespaceId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const tradespaceRef = doc(db, 'tradespaces', tradespaceId);

    // Remove tradespace from user's joined list
    await updateDoc(userRef, {
      joinedTradespaces: arrayRemove(tradespaceId),
    });

    // Decrement member count (but don't go below 0)
    const tradespaceSnap = await getDoc(tradespaceRef);
    const currentCount = tradespaceSnap.data()?.memberCount || 0;
    
    if (currentCount > 0) {
      await updateDoc(tradespaceRef, {
        memberCount: increment(-1),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error leaving tradespace:', error);
    throw error;
  }
}