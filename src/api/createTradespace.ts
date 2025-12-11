import { Timestamp, addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/config";

export async function createTradespace({
  name,
  description,
  thumbnailFile,
}: {
  name: string;
  description: string;
  thumbnailFile: File;
}) {
  // Upload image to Firebase Storage
  const storageRef = ref(storage, `tradespace-thumbnails/${Date.now()}-${thumbnailFile.name}`);
  await uploadBytes(storageRef, thumbnailFile);

  // Get public download URL
  const thumbnailUrl = await getDownloadURL(storageRef);

  // Save Firestore document
  const docRef = await addDoc(collection(db, "tradespaces"), {
    name,
    description,
    thumbnailUrl,
    createdAt: Timestamp.now(),
    trending: false,
    members: 0,
    postsPerDay: 0,
  });

  return {
    id: docRef.id,
    name,
    description,
    thumbnailUrl,
    trending: false,
    members: 0,
    postsPerDay: 0,
  };
}
