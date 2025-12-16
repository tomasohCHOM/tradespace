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

export const updateEmailAddress = async (email: string) => {
  if (!auth.currentUser) throw new Error('No authenticated user');

  try {
    // Requires email verification before update
    // We pass actionCodeSettings to ensure the link in the email returns the user to the app
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };

    await import('firebase/auth').then(({ verifyBeforeUpdateEmail }) =>
      verifyBeforeUpdateEmail(auth.currentUser!, email, actionCodeSettings),
    );
    // Note: refetching profile isn't useful yet as email hasn't changed.
    // Firestore update should happen AFTER verification, which we can't track here easily without a cloud function trigger.
    // For now, we will NOT update firestore until they verify and login with new email (which updates profile on login).
  } catch (error) {
    console.error('Error initiating email update', error);
    throw error;
  }
};

export const updateUserDisplayName = async (displayName: string) => {
  if (!auth.currentUser) throw new Error('No authenticated user');
  try {
    await updateProfile(auth.currentUser, { displayName });

    // Split name and update firestore
    const [firstName, ...lastNameParts] = displayName.split(' ');
    await createUserProfile(auth.currentUser.uid, {
      firstName: firstName || '',
      lastName: lastNameParts.join('') || '',
    } as any);
  } catch (error) {
    console.error('Error updating display name', error);
    throw error;
  }
};

export const updateUserPassword = async (
  newPassword: string,
  oldPassword: string,
) => {
  if (!auth.currentUser || !auth.currentUser.email)
    throw new Error('No authenticated user');

  try {
    // Re-authenticate first
    const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } =
      await import('firebase/auth');
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      oldPassword,
    );

    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    console.error('Error updating password', error);
    throw error;
  }
};

export const deleteUserAccount = async (password?: string) => {
  if (!auth.currentUser) throw new Error('No authenticated user');

  const uid = auth.currentUser.uid;

  try {
    // If password provided, re-auth first
    if (password && auth.currentUser.email) {
      const { EmailAuthProvider, reauthenticateWithCredential } = await import(
        'firebase/auth'
      );
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
    }

    // Cleanup data
    // We import dynamically to avoid circular dependencies if any (though unlikely here)
    // or just to keep main bundle small if this is rare action.
    const { deleteUserProfile } = await import('@/lib/firestore');
    const { deleteUserAvatar } = await import('@/lib/storage');

    await Promise.all([deleteUserProfile(uid), deleteUserAvatar(uid)]);

    // Delete the user
    await auth.currentUser.delete();
  } catch (error: any) {
    console.error('Error deleting user account', error);
    throw error;
  }
};
