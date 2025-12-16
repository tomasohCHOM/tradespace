import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/config';

export async function uploadUserAvatar(uid: string, file: File) {
  const storageRef = ref(storage, `avatars/${uid}/${file.name}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

export async function deleteUserAvatar(uid: string) {
  const { deleteObject, listAll } = await import('firebase/storage');
  const listRef = ref(storage, `avatars/${uid}`);

  // Find all files in the directory
  try {
    const res = await listAll(listRef);
    // Delete all files found
    const deletePromises = res.items.map((itemRef) => deleteObject(itemRef));
    await Promise.all(deletePromises);
  } catch (error) {
    // If directory doesn't exist or is empty, it might throw or just be fine.
    // We log but don't stop the process if deletion fails, as key goal is account removal.
    console.log('No avatar to delete or error deleting avatar:', error);
  }
}
