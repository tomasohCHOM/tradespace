import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function removeCartItem(uid: string, cartItemId: string) {
  await deleteDoc(doc(db, "users", uid, "cartItems", cartItemId));
}
