import { useEffect, useMemo, useState } from "react";
import { Clock, DollarSign, Filter, Plus, TrendingUp } from "lucide-react";
import {
  
  collection,
  limit,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";
import type {Timestamp} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { db } from "@/firebase/config";

import AddListingModal from "@/components/listings/AddListingModal";

interface Product {
  id: string;
  title: string;
  price: number;
  condition: string;
  seller: string;
  imageUrl: string;
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
  dateCreated?: Timestamp;
  tags?: Array<string>;
  offers?: number;
};

function firstImage(imageUrls: ListingDoc["imageUrls"]) {
  if (Array.isArray(imageUrls)) return String(imageUrls[0] ?? "");
  if (typeof imageUrls === "string") return imageUrls;
  return "";
}

function normalizeCondition(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function timeAgo(ms?: number) {
  if (!ms) return "Just now";
  const sec = Math.max(1, Math.floor((Date.now() - ms) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

type SortKey = "recent" | "price-low" | "price-high" | "popular";
type ConditionKey = "all" | "new" | "like-new" | "excellent" | "used";

export default function ProductsView({ tradespaceId }: { tradespaceId: string }) {
  const [sort, setSort] = useState<SortKey>("recent");
  const [condition, setCondition] = useState<ConditionKey>("all");

  const [products, setProducts] = useState<Array<Product>>([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);

  // firestore feed
  useEffect(() => {
    if (!tradespaceId) return;

    setLoading(true);

    const q = query(
      collection(db, "tradespaces", tradespaceId, "listings"),
      // backfill
      orderBy("dateCreated", "desc"),
      limit(60),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows: Array<Product> = snap.docs.map((d) => {
          const data = d.data() as ListingDoc;
          const createdAtMs = data.dateCreated?.toMillis?.();

          return {
            id: d.id,
            title: data.title ?? "Untitled listing",
            price: typeof data.price === "number" ? data.price : Number(data.price ?? 0),
            condition: data.condition ?? "Used",
            seller: data.sellerName ?? "Unknown",
            imageUrl: firstImage(data.imageUrls),
            postedAt: timeAgo(createdAtMs),
            tags: Array.isArray(data.tags) ? data.tags : [],
            offers: typeof data.offers === "number" ? data.offers : undefined,
            createdAtMs,
          };
        });

        setProducts(rows);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading listings:", err);
        setProducts([]);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [tradespaceId]);

  // Filter + Sort 
  const filteredAndSorted = useMemo(() => {
    let list = [...products];

    if (condition !== "all") {
      list = list.filter((p) => normalizeCondition(p.condition) === condition);
    }

    if (sort === "recent") list.sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0));
    if (sort === "price-low") list.sort((a, b) => a.price - b.price);
    if (sort === "price-high") list.sort((a, b) => b.price - a.price);
    if (sort === "popular") list.sort((a, b) => (b.offers ?? 0) - (a.offers ?? 0));

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
    <div className="p-6 w-full max-w-none ">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl mb-2">Marketplace</h2>
          <p className="text-muted-foreground">
            Browse and list products in this tradespace
          </p>
        </div>
       <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
            <Plus className="size-4" />
            List Product
            </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>

        <Select value={condition} onValueChange={(v) => setCondition(v as ConditionKey)}>
          <SelectTrigger className="w-[180px]">
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

        <Button variant="outline" className="gap-2">
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
              <p className="text-2xl">{loading ? "…" : activeListings}</p>
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
              <p className="text-2xl">{loading ? "…" : `$${avgPrice}`}</p>
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
              <p className="text-2xl">{loading ? "…" : newToday}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl text-primary">${product.price}</p>
                    <p className="text-xs text-muted-foreground">{product.condition}</p>
                  </div>
                  <Button size="sm">View Details</Button>
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

    </div>
  );
}
