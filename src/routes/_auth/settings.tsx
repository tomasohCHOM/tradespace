import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { updateProfile } from 'firebase/auth'; // Sort above internal imports
import { Loader2 } from 'lucide-react'; // Sort above internal imports

import { useAuth } from '@/context/AuthContext';
import {
  deleteUserAccount,
  updateEmailAddress,
  updateUserDisplayName,
  updateUserPassword,
} from '@/firebase/auth';

import { uploadUserAvatar } from '@/lib/storage';
import { updateUserProfile } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const Route = createFileRoute('/_auth/settings')({
  component: Settings,
});

function Settings() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const isPasswordUser = user?.providerData.some(
    (p) => p.providerId === 'password',
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    setMessage(null);
    setLoading(true);
    setMessage(null);
    try {
      const photoURL = await uploadUserAvatar(user.uid, file);
      await updateProfile(user, { photoURL });
      await updateUserProfile(user.uid, { photoURL });
      setMessage({
        type: 'success',
        text: 'Profile photo updated successfully!',
      });
    } catch (error: any) {
      console.error('Error updating photo:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile photo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);
    try {
      if (displayName !== user.displayName) {
        await updateUserDisplayName(displayName);
      }
      if (email !== user.email) {
        await updateEmailAddress(email);
        setMessage({
          type: 'success',
          text: `Verification email sent to ${email}. Please check your inbox to confirm the change.`,
        });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (
        error.code === 'auth/requires-recent-login' ||
        error.message?.includes('recent-login')
      ) {
        setMessage({
          type: 'error',
          text: 'Security check: Please logout and login again to change your email.',
        });
      } else {
        setMessage({
          type: 'error',
          text: error.message || 'Failed to update profile.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 6 characters.',
      });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await updateUserPassword(newPassword, currentPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password'
      ) {
        setMessage({ type: 'error', text: 'Incorrect current password.' });
      } else {
        setMessage({
          type: 'error',
          text: error.message || 'Failed to update password.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handleDeleteAccount = async () => {
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      await deleteUserAccount(deletePassword);
    } catch (error: any) {
      console.error('Error deleting account:', error);
      setIsDeleteDialogOpen(false);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to delete account. Please try again.',
      });
    } finally {
      setLoading(false);
      setDeletePassword('');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">User Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
        >
          {message.text}
        </div>
      )}

      <Card className="p-6">
        <div className="flex flex-col items-center sm:flex-row gap-6">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.photoURL || ''} />
              <AvatarFallback>
                {user?.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-medium">Change</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>

          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-medium">Profile Photo</h3>
            <p className="text-sm text-muted-foreground">
              Click the avatar to upload a new photo. JPG, GIF or PNG.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Changing your email may require you to sign in again.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Card>

      {isPasswordUser && (
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Security</h3>
            <p className="text-sm text-muted-foreground">
              Update your password.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password
              </label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                disabled={loading}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} variant="outline">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-red-900 dark:text-red-200">
              Account Deletion
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
          </div>

          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>

              {isPasswordUser && (
                <div className="space-y-2 py-2">
                  <label
                    htmlFor="deletePassword"
                    className="text-sm font-medium"
                  >
                    Confirm your Password
                  </label>
                  <Input
                    id="deletePassword"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={loading || (isPasswordUser && !deletePassword)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  );
}
