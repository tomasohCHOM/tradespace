import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import FallBackImage from "../../images/brokenimage.jpg";
import { 
  Search, 
  Users, 
  TrendingUp, 
  Star,
  ShoppingBag,
  MessageSquare,
  Plus,
  CheckCircle2
} from "lucide-react";
import { Fallback } from "@radix-ui/react-avatar";

// Create a route for /_auth/search
export const Route = createFileRoute('/_auth/search')({
  component: SearchView,
});


// Tradespace interface defining the structure of each tradespace
interface Tradespace {
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

// Mock data for demonstration
const mockTradespaces: Tradespace[] = [
  {
    id: "tech-gadgets",
    name: "Tech & Gadgets",
    description: "The ultimate marketplace for tech enthusiasts. Trade smartphones, laptops, gaming gear, and cutting-edge electronics.",
    category: "Technology",
    members: 45200,
    activeListings: 1840,
    postsPerDay: 320,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
    tags: ["Electronics", "Gaming", "Computers"],
    verified: true,
    trending: true,
    joined: true,
  },
  {
    id: "fashion-streetwear",
    name: "Fashion & Streetwear",
    description: "Buy, sell, and trade the latest streetwear, sneakers, and fashion pieces. From limited editions to everyday essentials.",
    category: "Fashion",
    members: 38900,
    activeListings: 2340,
    postsPerDay: 450,
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
    tags: ["Clothing", "Sneakers", "Accessories"],
    verified: true,
    trending: true,
  },
  {
    id: "rare-collectibles",
    name: "Rare Collectibles",
    description: "A curated space for trading rare collectibles, vintage items, trading cards, and limited edition memorabilia.",
    category: "Collectibles",
    members: 28600,
    activeListings: 980,
    postsPerDay: 150,
    imageUrl: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400",
    tags: ["Vintage", "Cards", "Memorabilia"],
    verified: true,
  },
  {
    id: "home-furniture",
    name: "Home & Furniture",
    description: "Find unique furniture pieces, home decor, and interior design items. Perfect for home makeovers and upgrades.",
    category: "Home & Living",
    members: 32400,
    activeListings: 1560,
    postsPerDay: 280,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    tags: ["Furniture", "Decor", "Interior"],
  },
  {
    id: "auto-parts",
    name: "Automotive Parts",
    description: "Trade automotive parts, accessories, and upgrades. From vintage car parts to modern performance mods.",
    category: "Automotive",
    members: 19800,
    activeListings: 750,
    postsPerDay: 120,
    imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
    tags: ["Cars", "Parts", "Modifications"],
    verified: true,
  },
  {
    id: "sports-equipment",
    name: "Sports & Outdoor",
    description: "Sports equipment, outdoor gear, and fitness accessories. Everything from bikes to camping equipment.",
    category: "Sports",
    members: 24100,
    activeListings: 1120,
    postsPerDay: 190,
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400",
    tags: ["Sports", "Outdoor", "Fitness"],
  },
  {
    id: "music-instruments",
    name: "Music & Instruments",
    description: "Buy, sell, and trade musical instruments, audio equipment, and production gear from guitars to synthesizers.",
    category: "Music",
    members: 16700,
    activeListings: 620,
    postsPerDay: 95,
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
    tags: ["Instruments", "Audio", "Production"],
    verified: true,
  },
  {
    id: "books-media",
    name: "Books & Media",
    description: "Exchange books, vinyl records, DVDs, and other media. Connect with fellow readers and collectors.",
    category: "Media",
    members: 14300,
    activeListings: 890,
    postsPerDay: 165,
    imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
    tags: ["Books", "Vinyl", "Movies"],
  },
  {
    id: "art-craft",
    name: "Art & Handmade Crafts",
    description: "A creative marketplace for original artwork, handmade crafts, and artisan goods from talented creators.",
    category: "Art",
    members: 21500,
    activeListings: 1450,
    postsPerDay: 220,
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
    tags: ["Art", "Handmade", "Creative"],
  },
  {
    id: "gaming-digital",
    name: "Gaming & Digital",
    description: "Trade gaming accounts, digital items, game codes, and in-game collectibles across all major platforms.",
    category: "Gaming",
    members: 42800,
    activeListings: 2100,
    postsPerDay: 580,
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FtaW5nfGVufDB8fDB8fHww",
    tags: ["Gaming", "Digital", "Accounts"],
    trending: true,
  },
  {
    id: "photography-gear",
    name: "Photography Gear",
    description: "Professional and amateur photography equipment. Cameras, lenses, lighting, and accessories for all skill levels.",
    category: "Photography",
    members: 18900,
    activeListings: 780,
    postsPerDay: 140,
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    tags: ["Cameras", "Lenses", "Equipment"],
  },
  {
    id: "watch-enthusiasts",
    name: "Watch Enthusiasts",
    description: "Trade luxury watches, vintage timepieces, and modern smartwatches. For collectors and watch lovers.",
    category: "Accessories",
    members: 12400,
    activeListings: 340,
    postsPerDay: 85,
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
    tags: ["Watches", "Luxury", "Vintage"],
    verified: true,
  },
];

function SearchView() {
  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Discover Tradespaces</h2>
        <p className="text-muted-foreground">
          Find and join tradespaces that match your interests
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search tradespaces by name, category, or tags..." 
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ShoppingBag className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Tradespaces</p>
              <p className="text-2xl">127</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Users className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl">487k</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <MessageSquare className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Activity</p>
              <p className="text-2xl">3.2k</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Categories Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="default" size="sm">All</Button>
          <Button variant="outline" size="sm">Technology</Button>
          <Button variant="outline" size="sm">Fashion</Button>
          <Button variant="outline" size="sm">Collectibles</Button>
          <Button variant="outline" size="sm">Home & Living</Button>
          <Button variant="outline" size="sm">Automotive</Button>
          <Button variant="outline" size="sm">Sports</Button>
          <Button variant="outline" size="sm">More</Button>
        </div>
      </div>

      {/* Trending Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="size-5 text-orange-600" />
          <h3 className="text-lg">Trending Now</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTradespaces.filter(ts => ts.trending).map((tradespace) => (
            <Card key={tradespace.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">

              {/* Card Image with fallback */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={tradespace.imageUrl}
                  alt={tradespace.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"

                  // Fallback image if original fails to load
                  onError={(e) => {
                    e.currentTarget.onerror = null; // prevent infinite loop
                    e.currentTarget.src = FallBackImage; // set your default image here
                  }}
                />

                {/* Trending Badge */}
                <Badge className="absolute top-2 left-2 bg-orange-500 gap-1">
                  <TrendingUp className="size-3" />
                  Trending
                </Badge>

                {/* Verified Badge */}
                {tradespace.verified && (
                  <Badge className="absolute top-2 right-2 bg-blue-600 gap-1">
                    <CheckCircle2 className="size-3" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="mb-1">{tradespace.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tradespace.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {tradespace.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Members</p>
                    <p className="text-sm">{(tradespace.members / 1000).toFixed(1)}k</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Listings</p>
                    <p className="text-sm">{tradespace.activeListings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Posts/Day</p>
                    <p className="text-sm">{tradespace.postsPerDay}</p>
                  </div>
                </div>

                {/* Join Button */}
                <Button 
                  className="w-full gap-2" 
                  variant={tradespace.joined ? "outline" : "default"}
                >
                  {tradespace.joined ? (
                    <>
                      <CheckCircle2 className="size-4" />
                      Joined
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      Join Tradespace
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* All Tradespaces Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">All Tradespaces</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Star className="size-4 mr-2" />
              Most Popular
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTradespaces.filter(ts => !ts.trending).map((tradespace) => (
            <Card key={tradespace.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">

              {/* Card Image with fallback */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={tradespace.imageUrl}
                  alt={tradespace.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/fallback.jpg";
                  }}
                />

                {/* Verified Badge */}
                {tradespace.verified && (
                  <Badge className="absolute top-2 right-2 bg-blue-600 gap-1">
                    <CheckCircle2 className="size-3" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="mb-1">{tradespace.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tradespace.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {tradespace.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Members</p>
                    <p className="text-sm">{(tradespace.members / 1000).toFixed(1)}k</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Listings</p>
                    <p className="text-sm">{tradespace.activeListings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Posts/Day</p>
                    <p className="text-sm">{tradespace.postsPerDay}</p>
                  </div>
                </div>

                {/* Join Button */}
                <Button 
                  className="w-full gap-2" 
                  variant={tradespace.joined ? "outline" : "default"}
                >
                  {tradespace.joined ? (
                    <>
                      <CheckCircle2 className="size-4" />
                      Joined
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      Join Tradespace
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Load More Button */}
      <div className="mt-8 text-center">
        <Button variant="outline" size="lg">
          Load More Tradespaces
        </Button>
      </div>
    </div>
  );
}
