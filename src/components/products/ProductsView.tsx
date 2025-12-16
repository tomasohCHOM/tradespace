import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Filter,
  MessageCircle,
  Plus,
  ShoppingCart,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useNavigate } from '@tanstack/react-router';
import type { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { addToCart } from '@/api/cart/addToCart';

import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';

import AddListingModal from '@/components/listings/AddListingModal';

interface Product {
  id: string;
  title: string;
  price: number;
  condition: string;
  seller: string;
  sellerId?: string;
  imageUrl: string;
  imageUrls?: Array<string>;
  description?: string;
  postedAt: string;
  tags: Array<string>;
  offers?: number;
  createdAtMs?: number;
}

type ListingDoc = {
  title?: string;
  price?: number;
  condition?: string;
  sellerName?: string;
  sellerId?: string;
  imageUrls?: Array<string> | string;
  description?: string;
  dateCreated?: Timestamp;
  tags?: Array<string>;
  offers?: number;
};

function firstImage(imageUrls: ListingDoc['imageUrls']) {
  if (Array.isArray(imageUrls)) return String(imageUrls[0] ?? '');
  if (typeof imageUrls === 'string') return imageUrls;
  return '';
}

function normalizeCondition(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

function timeAgo(ms?: number) {
  if (!ms) return 'Just now';
  const sec = Math.max(1, Math.floor((Date.now() - ms) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

type SortKey = 'recent' | 'price-low' | 'price-high' | 'popular';
type ConditionKey = 'all' | 'new' | 'like-new' | 'excellent' | 'used';

export default function ProductsView({
  tradespaceId,
}: {
  tradespaceId: string;
}) {
  const [sort, setSort] = useState<SortKey>('recent');
  const [condition, setCondition] = useState<ConditionKey>('all');

  const [products, setProducts] = useState<Array<Product>>([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [editDescription, setEditDescription] = useState('');

  const { user } = useAuth();

  const navigate = useNavigate();
  const [addingId, setAddingId] = useState<string | null>(null);

  async function handleAddToCart(p: Product) {
    if (!user) {
      alert('Please log in to add to cart.');
      return;
    }
    if (p.sellerId && p.sellerId === user.uid) {
      alert("You can't add your own listing to your cart.");
      return;
    }

    setAddingId(p.id);
    try {
      await addToCart({
        uid: user.uid,
        tradespaceId,
        listingId: p.id,
        title: p.title,
        price: p.price,
        sellerId: p.sellerId ?? 'unknown',
        sellerName: p.seller,
        imageUrl: p.imageUrl || null,
        condition: p.condition,
      });
    } catch (err: any) {
      console.error('Add to cart failed:', err);
      alert(err?.message ?? 'Failed to add to cart');
    } finally {
      setAddingId(null);
    }
  }

  // firestore feed
  useEffect(() => {
    if (!tradespaceId) return;

    setLoading(true);

    const q = query(
      collection(db, 'tradespaces', tradespaceId, 'listings'),
      // backfill
      orderBy('dateCreated', 'desc'),
      limit(60),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows: Array<Product> = snap.docs.map((d) => {
          const data = d.data() as ListingDoc;
          const createdAtMs = data.dateCreated
            ? data.dateCreated.toMillis()
            : undefined;

          return {
            id: d.id,
            title:
              typeof data.title === 'string' && data.title.length
                ? data.title
                : 'Untitled listing',
            price:
              typeof data.price === 'number'
                ? data.price
                : typeof data.price === 'string'
                  ? Number(data.price) || 0
                  : 0,
            condition:
              typeof data.condition === 'string' && data.condition.length
                ? data.condition
                : 'Used',
            seller:
              typeof data.sellerName === 'string' && data.sellerName.length
                ? data.sellerName
                : 'Unknown',
            sellerId:
              typeof data.sellerId === 'string' ? data.sellerId : undefined,
            imageUrl: firstImage(data.imageUrls),
            imageUrls: Array.isArray(data.imageUrls)
              ? data.imageUrls
              : typeof data.imageUrls === 'string'
                ? [data.imageUrls]
                : [],
            description:
              typeof data.description === 'string'
                ? data.description
                : undefined,
            postedAt: timeAgo(createdAtMs),
            tags: Array.isArray(data.tags) ? data.tags : [],
            offers: typeof data.offers === 'number' ? data.offers : undefined,
            createdAtMs,
          };
        });

        setProducts(rows);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading listings:', err);
        setProducts([]);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [tradespaceId]);

  // Filter + Sort
  const filteredAndSorted = useMemo(() => {
    let list = [...products];

    if (condition !== 'all') {
      list = list.filter((p) => normalizeCondition(p.condition) === condition);
    }

    if (sort === 'recent')
      list.sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0));
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    if (sort === 'popular')
      list.sort((a, b) => (b.offers ?? 0) - (a.offers ?? 0));

    return list;
  }, [products, condition, sort]);

  // Stats
  const activeListings = products.length;

  const avgPrice = useMemo(() => {
    if (!products.length) return 0;
    const sum = products.reduce((acc, p) => acc + (p.price || 0), 0);
    return Math.round(sum / products.length);
  }, [products]);

  const newToday = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const startMs = start.getTime();
    return products.filter((p) => (p.createdAtMs ?? 0) >= startMs).length;
  }, [products]);

  return (
    <div className="p-4 sm:p-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl mb-2">Marketplace</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Browse and list products in this tradespace
          </p>
        </div>
        <Button
          className="gap-2 w-full md:w-auto"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="size-4" />
          List Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={condition}
          onValueChange={(v) => setCondition(v as ConditionKey)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="like-new">Like New</SelectItem>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="used">Used</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2 w-full sm:w-auto">
          <Filter className="size-4" />
          More Filters
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Listings</p>
              <p className="text-2xl">{loading ? '…' : activeListings}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <DollarSign className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Price</p>
              <p className="text-2xl">{loading ? '…' : `$${avgPrice}`}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Clock className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">New Today</p>
              <p className="text-2xl">{loading ? '…' : newToday}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <Card className="p-6 text-muted-foreground">Loading listings…</Card>
        ) : filteredAndSorted.length === 0 ? (
          <Card className="p-6 text-muted-foreground">No listings found.</Card>
        ) : (
          filteredAndSorted.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                <ImageWithFallback
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {product.offers && (
                  <Badge className="absolute top-2 right-2 bg-orange-500">
                    {product.offers} Offers
                  </Badge>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="line-clamp-2 mb-1">{product.title}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-2xl text-primary">${product.price}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.condition}
                    </p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={!user || addingId === product.id}
                    >
                      {addingId === product.id ? 'Adding...' : 'Add'}
                    </Button>

                    <Button
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(product);
                        setEditTitle(product.title);
                        setEditPrice(String(product.price));
                        setEditDescription(product.description ?? '');
                        setIsEditing(false);
                        setIsDetailsOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between text-sm text-muted-foreground">
                  <span>By {product.seller}</span>
                  <span>{product.postedAt}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Load More (paging later) */}
      <div className="mt-8 text-center">
        <Button variant="outline" size="lg" disabled>
          Load More Products
        </Button>
      </div>

      {/* Render add listing */}
      <AddListingModal
        tradespaceId={tradespaceId}
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
      />

      {/* Listing Details Modal */}
      <Dialog
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelected(null);
            setIsEditing(false);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selected?.title}</DialogTitle>
          </DialogHeader>

          {/* Product Image */}
          <div className="w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            <ImageWithFallback
              src={
                (selected?.imageUrls && selected.imageUrls[0]) ||
                selected?.imageUrl
              }
              alt={selected?.title || ''}
              className="w-full max-h-[45dvh] object-contain"
            />
          </div>

          {/* Price and Condition */}
          <div className="flex items-center justify-between mt-4">
            <div>
              {!isEditing ? (
                <>
                  <p className="text-3xl text-primary mb-1">
                    ${selected?.price}
                  </p>
                  {selected?.condition && (
                    <Badge variant="secondary">{selected.condition}</Badge>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="number"
                    className="rounded-md border px-3 py-2 w-32 min-w-[100px]"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                  <Badge variant="secondary">{selected?.condition}</Badge>
                </div>
              )}
            </div>
            {selected?.offers && (
              <Badge className="bg-orange-500">
                {selected.offers} Active Offers
              </Badge>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h4 className="mb-2">Description</h4>
            {!isEditing ? (
              <p className="text-muted-foreground">{selected?.description}</p>
            ) : (
              <textarea
                className="w-full rounded-md border px-3 py-2 min-h-[100px] max-h-[200px] resize-y"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            {selected &&
              selected.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
          </div>

          <Separator />

          {/* Details */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Posted</p>
                <p className="text-sm">{selected?.postedAt}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seller Info */}
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback>{selected?.seller[0] ?? '?'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-muted-foreground">Seller</p>
              <p className="text-sm">{selected?.seller}</p>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {user && selected?.sellerId && user.uid === selected.sellerId ? (
              <>
                {!isEditing ? (
                  <>
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="size-4" />
                      Edit Listing
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 gap-2"
                      onClick={async () => {
                        const ok = confirm(
                          'Delete this listing? This cannot be undone.',
                        );
                        if (!ok) return;
                        try {
                          const { deleteDoc, doc } = await import(
                            'firebase/firestore'
                          );
                          await deleteDoc(
                            doc(
                              db,
                              'tradespaces',
                              tradespaceId,
                              'listings',
                              selected.id,
                            ),
                          );
                          setProducts((prev) =>
                            prev.filter((p) => p.id !== selected.id),
                          );
                          setIsDetailsOpen(false);
                        } catch (err) {
                          console.error('Delete failed', err);
                          alert('Failed to delete listing');
                        }
                      }}
                    >
                      <Trash2 className="size-4" />
                      Delete Listing
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="flex-1 gap-2"
                      onClick={async () => {
                        try {
                          const { updateDoc, doc } = await import(
                            'firebase/firestore'
                          );
                          await updateDoc(
                            doc(
                              db,
                              'tradespaces',
                              tradespaceId,
                              'listings',
                              selected.id,
                            ),
                            {
                              title: editTitle,
                              price: Number(editPrice) || 0,
                              description: editDescription,
                            },
                          );
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id === selected.id
                                ? {
                                    ...p,
                                    title: editTitle,
                                    price: Number(editPrice) || 0,
                                    description: editDescription,
                                  }
                                : p,
                            ),
                          );
                          setIsEditing(false);
                        } catch (err) {
                          console.error('Failed to save listing edits', err);
                          alert('Failed to save edits');
                        }
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => {
                        setIsEditing(false);
                        setEditTitle(selected.title);
                        setEditPrice(String(selected.price));
                        setEditDescription(selected.description ?? '');
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button
                  className="flex-1 gap-2"
                  onClick={async () => {
                    if (!selected) return;
                    await handleAddToCart(selected);
                    // take them to cart after adding
                    navigate({ to: '/cart' });
                  }}
                  disabled={!user || selected?.sellerId === user.uid}
                >
                  <ShoppingCart className="size-4" />
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => alert('Make offer')}
                >
                  <MessageCircle className="size-4" />
                  Make Offer
                </Button>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
