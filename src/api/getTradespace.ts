import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/firebase/config";


export interface Tradespace { //Probably need to remove some types here.
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  activeListings: number;
  postsPerDay: number;
  imageUrl: string;
  tags: string[];
  verified?: boolean;
  trending?: boolean;
  joined?: boolean;
}

//This function simply gets tradespaces from firestore for the explore page.

export async function getTradespace(): Promise<Tradespace[]> {
  const colRef = collection(db, "tradespaces");
  const snapshot = await getDocs(colRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Tradespace[];
}
console.log("DB instance in getTradespace:", db);