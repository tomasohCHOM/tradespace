import { doc, runTransaction } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function leaveTradespace(tradespaceId: string, uid: string) {
  const tradespaceRef = doc(db, 'tradespaces', tradespaceId);
  const memberRef = doc(db, 'tradespaces', tradespaceId, 'members', uid);
  const userTradespacesRef = doc(db, 'users', uid, 'tradespaces', tradespaceId);

  await runTransaction(db, async (tx) => {
    const [memberSnap, tradespaceSnap] = await Promise.all([
      tx.get(memberRef),
      tx.get(tradespaceRef),
    ]);

    if (!memberSnap.exists()) return;
    if (!tradespaceSnap.exists()) {
      throw new Error('Tradespace does not exist');
    }

    const data = tradespaceSnap.data();
    const currentCount = data.memberCount ?? 0;

    // Delete membership docs
    tx.delete(memberRef);
    tx.delete(userTradespacesRef);

    // Decrement member count but don't go below 0
    tx.update(tradespaceRef, {
      memberCount: Math.max(0, currentCount - 1),
    });
  });

  // Notify other parts of the app that the user's tradespaces may have changed.
  try {
    window.dispatchEvent(new CustomEvent('tradespaces:changed'));
  } catch (err) {
    // ignore in non-browser environments
  }
}
