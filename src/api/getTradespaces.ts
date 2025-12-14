import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Tradespace } from '@/types/tradespace';

// This function simply gets tradespaces from firestore for the explore page.
export async function getTradespaces(): Promise<Array<Tradespace>> {
  const colRef = collection(db, 'tradespaces');
  const snapshot = await getDocs(colRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Array<Tradespace>;
}
