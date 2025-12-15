import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function updateCartQuantity(uid: string, cartItemId: string, quantity: number) {
  const ref = doc(db, "users", uid, "cartItems", cartItemId);
  await updateDoc(ref, { quantity });
}
