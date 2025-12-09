import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { auth } from './config';

import { createUserProfile } from '@/lib/firestore';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Create profile if its their first sign in
    const displayName = result.user.displayName || '';
    const [firstName, ...lastNameParts] = displayName.split(' ');

    await createUserProfile(result.user.uid, {
      firstName: firstName || '',
      lastName: lastNameParts.join('') || '',
      email: result.user.email || '',
    });

    return result.user;
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error('Error signing in with email', error);
    throw error;
  }
};

export const signUpWithEmail = async (
  email: string,
  pass: string,
  firstName: string,
  lastName: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass,
    );

    await updateProfile(userCredential.user, {
      // NOTE: We will use the users username as the displayName in the future
      displayName: `${firstName} ${lastName}`,
    });

    await createUserProfile(userCredential.user.uid, {
      firstName,
      lastName,
      email,
    });

    return userCredential.user;
  } catch (error) {
    console.error('Error signing up with email', error);
    throw error;
  }
};
