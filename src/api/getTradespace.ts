import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/firebase/config";


export type Tradespace = {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  trending?: boolean;
  members?: number;
  postsPerDay?: number;
  activeListings?: number;
  tags?: string[];
  category?: string;
};


//This function simply gets tradespaces from firestore for the explore page.

export async function getTradespace(): Promise<Tradespace[]> {
  const colRef = collection(db, "tradespaces");
  const snapshot = await getDocs(colRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Tradespace[];
}