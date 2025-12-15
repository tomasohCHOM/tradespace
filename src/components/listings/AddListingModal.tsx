import { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  tradespaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddListingModal({ tradespaceId, open, onOpenChange }: Props) {
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [condition, setCondition] = useState("Used");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const p = Number(price);
    return !!user && tradespaceId && title.trim().length > 0 && !Number.isNaN(p) && p >= 0;
  }, [user, tradespaceId, title, price]);

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be logged in to create a listing.");
      return;
    }

    const p = Number(price);
    if (Number.isNaN(p) || p < 0) {
      setError("Please enter a valid price.");
      return;
    }

    setSaving(true);
    try {
      let imageUrls: Array<string> = [];

     
      if (imageFile) {
        const safeName = imageFile.name.replace(/[^\w.-]+/g, "_");
        const path = `tradespaces/${tradespaceId}/listings/${user.uid}/${Date.now()}-${safeName}`;
        const storageRef = ref(storage, path);

        await uploadBytes(storageRef, imageFile);
        const url = await getDownloadURL(storageRef);
        imageUrls = [url];
      }

      await addDoc(collection(db, "tradespaces", tradespaceId, "listings"), {
        title: title.trim(),
        description: description.trim(),
        price: p,
        condition,
        sellerId: user.uid,
        sellerName: user.displayName ?? user.email ?? "Unknown",
        imageUrls,
        dateCreated: serverTimestamp(),
        offers: 0,
        tags: [],
      });

      // reset and close
      setTitle("");
      setDescription("");
      setPrice("");
      setCondition("Used");

      setImageFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);

      onOpenChange(false);
    } catch (err: any) {
      console.error("Create listing failed:", err);
      setError(err?.message ?? "Failed to create listing.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>List a Product</DialogTitle>
          <DialogDescription>
            Create a new listing for this tradespace marketplace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mechanical keyboard"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full rounded-md border px-3 py-2 min-h-[90px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, condition notes, what's included..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                inputMode="decimal"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Condition</label>
              <select
                className="w-full rounded-md border px-3 py-2"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option>New</option>
                <option>Like New</option>
                <option>Excellent</option>
                <option>Used</option>
              </select>
            </div>
          </div>

          {/* only one image, avoid spam uploads*/}
          <div className="space-y-2">
            <label className="text-sm font-medium">Image (1)</label>
            <input
              type="file"
              accept="image/*"
              onChange={onPickImage}
              className="w-full rounded-md border px-3 py-2"
            />

            {previewUrl && (
              <div className="mt-2 rounded-md border p-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-56 object-contain rounded"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setImageFile(null);
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                  }}
                >
                  Remove Image
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || saving}>
              {saving ? "Listing..." : "Create Listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
