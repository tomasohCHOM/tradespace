import { doc, getDoc } from 'firebase/firestore';
import type { Tradespace } from '@/types/tradespace';
import { db } from '@/firebase/config';

export async function getTradespacesByIds(
  ids: Array<string>,
): Promise<Array<Tradespace>> {
  const results: Array<Tradespace> = [];

  await Promise.all(
    ids.map(async (id) => {
      try {
        const ref = doc(db, 'tradespaces', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          results.push({ id: snap.id, ...(snap.data() as any) } as Tradespace);
        }
      } catch (err) {
        console.warn('Failed to load tradespace', id, err);
      }
    }),
  );

  return results;
}
