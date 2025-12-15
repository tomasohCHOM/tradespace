import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function addToCart({
  uid,
  tradespaceId,
  listingId,
  title,
  price,
  sellerId,
  sellerName,
  imageUrl,
  condition,
}: {
  uid: string;
  tradespaceId: string;
  listingId: string;
  title: string;
  price: number;
  sellerId: string;
  sellerName: string;
  imageUrl: string | null;
  condition: string;
}) {
  const cartItemId = `${tradespaceId}_${listingId}`;
  const ref = doc(db, "users", uid, "cartItems", cartItemId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);

    if (snap.exists()) {
      const qty = snap.data().quantity ?? 1;
      tx.update(ref, {
        quantity: qty + 1,
        updatedAt: serverTimestamp(),
      });
    } else {
      tx.set(ref, {
        tradespaceId,
        listingId,
        title,
        price,
        sellerId,
        sellerName,
        imageUrl,
        condition,
        quantity: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  });
}
