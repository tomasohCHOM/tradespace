import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../src/firebase/config';
import type { Tradespace } from '@/types/tradespace';

export async function getUserTradespaces(
  uid: string,
): Promise<Array<Tradespace>> {
  const snapshot = await getDocs(collection(db, 'users', uid, 'tradespaces'));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Array<Tradespace>;
}
