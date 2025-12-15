import { Timestamp, doc, runTransaction } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function joinTradespace(tradespaceId: string, uid: string) {
  const tradespaceRef = doc(db, 'tradespaces', tradespaceId);
  const memberRef = doc(db, 'tradespaces', tradespaceId, 'members', uid);
  const userTradespacesRef = doc(db, 'users', uid, 'tradespaces', tradespaceId);

  await runTransaction(db, async (tx) => {
    const [memberSnap, tradespaceSnap] = await Promise.all([
      tx.get(memberRef),
      tx.get(tradespaceRef),
    ]);

    if (memberSnap.exists()) return;
    if (!tradespaceSnap.exists()) {
      throw new Error('Tradespace does not exist');
    }

    const data = tradespaceSnap.data();
    const currentCount = data.memberCount ?? 0;

    // Tradespace membership doc
    tx.set(memberRef, {
      role: 'member',
      joinedAt: Timestamp.now(),
    });

    // include name
    tx.set(userTradespacesRef, {
      role: 'member',
      joinedAt: Timestamp.now(),
      name: data.name,                
    });

    tx.update(tradespaceRef, {
      memberCount: currentCount + 1,
    });
  });
}
