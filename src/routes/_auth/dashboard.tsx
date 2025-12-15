import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  MessageSquare,
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { Tradespace } from '@/types/tradespace';
import { useAuth } from '@/context/AuthContext';
import { getUserTradespaces } from '@/api/getUserTradespaces';
import { getTradespacesByIds } from '@/api/getTradespacesByIds';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ImageWithFallback } from '@/components/ImageWithFallback';

export const Route = createFileRoute('/_auth/dashboard')({
  component: Dashboard,
});

interface RecentActivity {
  id: string;
  type: 'trade' | 'post' | 'offer' | 'listing';
  title: string;
  description: string;
  timestamp: string;
  tradespace: string;
  user?: string;
  userInitials?: string;
}

interface TrendingProduct {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  tradespace: string;
  offers: number;
  views: number;
}

interface ActiveTrade {
  id: string;
  product: string;
  status: 'pending' | 'accepted' | 'counter';
  otherUser: string;
  userInitials: string;
  timestamp: string;
  amount: number;
}

const mockRecentActivity: Array<RecentActivity> = [
  {
    id: '1',
    type: 'offer',
    title: 'New offer on your Mechanical Keyboard',
    description: 'TechBuyer offered $85 for your item',
    timestamp: '5 minutes ago',
    tradespace: 'Tech & Gadgets',
    user: 'TechBuyer',
    userInitials: 'TB',
  },
  {
    id: '2',
    type: 'post',
    title: 'VintageCollector replied to your forum post',
    description:
      "Great insights! I've been using similar pricing strategies...",
    timestamp: '1 hour ago',
    tradespace: 'Fashion & Streetwear',
    user: 'VintageCollector',
    userInitials: 'VC',
  },
  {
    id: '3',
    type: 'listing',
    title: 'New listing in Collectibles & Cards',
    description: 'Rare Pokemon Card Collection - Mint Condition',
    timestamp: '2 hours ago',
    tradespace: 'Collectibles & Cards',
  },
  {
    id: '4',
    type: 'trade',
    title: 'Trade completed successfully',
    description: 'You received $149.99 for Wireless Headphones',
    timestamp: '5 hours ago',
    tradespace: 'Tech & Gadgets',
    user: 'AudioFan',
    userInitials: 'AF',
  },
  {
    id: '5',
    type: 'post',
    title: 'Your post received 10 new likes',
    description: 'Best practices for pricing vintage items',
    timestamp: '8 hours ago',
    tradespace: 'Tech & Gadgets',
  },
];

const mockTrendingProducts: Array<TrendingProduct> = [
  {
    id: '1',
    title: 'Limited Edition Sneakers - Size 10',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    tradespace: 'Fashion & Streetwear',
    offers: 12,
    views: 834,
  },
  {
    id: '2',
    title: 'Vintage Polaroid Camera',
    price: 189.99,
    imageUrl:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
    tradespace: 'Tech & Gadgets',
    offers: 8,
    views: 621,
  },
  {
    id: '3',
    title: 'First Edition Pokemon Cards Set',
    price: 599.99,
    imageUrl:
      'https://images.unsplash.com/photo-1613421302898-35e99c5d3b07?w=400',
    tradespace: 'Collectibles & Cards',
    offers: 15,
    views: 1243,
  },
  {
    id: '4',
    title: 'Designer Leather Jacket',
    price: 449.99,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    tradespace: 'Fashion & Streetwear',
    offers: 6,
    views: 492,
  },
];

const mockActiveTrades: Array<ActiveTrade> = [
  {
    id: '1',
    product: 'Mechanical Gaming Keyboard',
    status: 'pending',
    otherUser: 'TechBuyer',
    userInitials: 'TB',
    timestamp: '2 hours ago',
    amount: 85,
  },
  {
    id: '2',
    product: 'Smart Watch - Fitness Edition',
    status: 'counter',
    otherUser: 'GadgetLover',
    userInitials: 'GL',
    timestamp: '1 day ago',
    amount: 175,
  },
  {
    id: '3',
    product: 'Vintage Band T-Shirt',
    status: 'accepted',
    otherUser: 'FashionFan',
    userInitials: 'FF',
    timestamp: '2 days ago',
    amount: 45,
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'trade':
      return <ShoppingCart className="size-4" />;
    case 'post':
      return <MessageSquare className="size-4" />;
    case 'offer':
      return <DollarSign className="size-4" />;
    case 'listing':
      return <Package className="size-4" />;
    default:
      return <Activity className="size-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'trade':
      return 'bg-green-500/10 text-green-600';
    case 'post':
      return 'bg-blue-500/10 text-blue-600';
    case 'offer':
      return 'bg-orange-500/10 text-orange-600';
    case 'listing':
      return 'bg-purple-500/10 text-purple-600';
    default:
      return 'bg-gray-500/10 text-gray-600';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'accepted':
      return <Badge className="bg-green-500">Accepted</Badge>;
    case 'counter':
      return <Badge className="bg-orange-500">Counter Offer</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [joined, setJoined] = useState<Array<Tradespace>>([]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const uid = user!.uid;
      const userTs = await getUserTradespaces(uid);
      const ids = userTs.map((t) => t.id);
      if (ids.length === 0) {
        setJoined([]);
        return;
      }

      const full = await getTradespacesByIds(ids);
      setJoined(full);
    }

    load();
    function handleRefresh() {
      load();
    }

    window.addEventListener(
      'tradespaces:changed',
      handleRefresh as EventListener,
    );
    return () =>
      window.removeEventListener(
        'tradespaces:changed',
        handleRefresh as EventListener,
      );
  }, [user]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening across your tradespaces.
        </p>
      </div>

      {/* Joined Tradespaces */}
      <div className="mb-6">
        <h3 className="text-lg mb-3">Your Tradespaces</h3>

        <Card className="p-4">
          {joined.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You haven't joined any tradespaces yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {joined.map((ts) => (
                <div
                  key={ts.id}
                  className="flex items-center gap-3 p-2 border rounded-md"
                >
                  <div className="size-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <ImageWithFallback
                      src={ts.thumbnailUrl}
                      alt={ts.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold line-clamp-1">{ts.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ts.memberCount ?? 0} members
                    </p>
                  </div>
                  <div>
                    <Button
                      onClick={() =>
                        navigate({ to: `/tradespaces/${ts.id}/products` })
                      }
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      View Products
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tradespaces</p>
              <p className="text-2xl">4</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Listings</p>
              <p className="text-2xl">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <DollarSign className="size-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Offers</p>
              <p className="text-2xl">28</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <ShoppingCart className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl">156</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="size-5" />
                <h3>Recent Activity</h3>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div
                    className={`size-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(
                      activity.type,
                    )}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="mb-1">{activity.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {activity.tradespace}
                      </Badge>
                      <span>•</span>
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5" />
                <h3>Trending Products</h3>
              </div>
              <Button variant="ghost" size="sm">
                Explore
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {mockTrendingProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <ImageWithFallback
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <Badge className="absolute top-2 right-2 bg-orange-500">
                      {product.offers} Offers
                    </Badge>
                  </div>
                  <div className="p-3 space-y-2">
                    <h4 className="line-clamp-1">{product.title}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-primary">${product.price}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Activity className="size-3" />
                        {product.views} views
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {product.tradespace}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-5" />
                <h3>Active Trades</h3>
              </div>
            </div>

            <div className="space-y-4">
              {mockActiveTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="p-3 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">
                        {trade.userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-1 mb-1">
                        {trade.product}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trade.otherUser}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">${trade.amount}</p>
                    {getStatusBadge(trade.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {trade.timestamp}
                  </p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              View All Trades
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="size-5" />
              <h3>Quick Actions</h3>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Package className="size-4" />
                List New Product
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquare className="size-4" />
                Create Forum Post
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="size-4" />
                Browse Tradespaces
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="size-5" />
              <h3>This Week</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Product Views
                  </span>
                  <span className="text-sm">2,341</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[68%]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Offers Received
                  </span>
                  <span className="text-sm">18</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[45%]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Forum Engagement
                  </span>
                  <span className="text-sm">124</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[82%]"></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <ArrowUpRight className="size-4" />
                <span>+12% from last week</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
