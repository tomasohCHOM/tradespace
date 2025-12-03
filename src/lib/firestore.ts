import { doc, getDoc, setDoc } from 'firebase/firestore';
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
      createdAt: new Date().toISOString(),
    });
  }
}
