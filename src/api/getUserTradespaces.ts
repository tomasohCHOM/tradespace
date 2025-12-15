import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../src/firebase/config';
import type { Tradespace } from '@/types/tradespace';

export async function getUserTradespaces(
  uid: string,
): Promise<Array<Tradespace>> {
  const snapshot = await getDocs(collection(db, 'users', uid, 'tradespaces'));

  const tradespaces = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const tsRef = doc(db, 'tradespaces', docSnap.id);
      const tsSnap = await getDoc(tsRef);

      return {
        id: tsSnap.id,
        ...tsSnap.data(),
      };
    }),
  );

  return tradespaces as Array<Tradespace>;
}
