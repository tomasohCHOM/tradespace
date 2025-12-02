import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export async function createUserProfile(
  uid: string,
  data: {
    firstName: string;
    lastName: string;
    email: string,
  }
) {
  await setDoc(doc(db, 'users', uid),  {
    ...data,
    createdAt: new Date().toISOString(),
  });
}
