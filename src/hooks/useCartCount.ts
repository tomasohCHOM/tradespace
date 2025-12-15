import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";

export function useCartCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }
    const ref = collection(db, "users", user.uid, "cartItems");
    return onSnapshot(ref, (snap) => setCount(snap.size));
  }, [user]);

  return count;
}
