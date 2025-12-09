import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Search,
  ShoppingBag,
  Users,
  MessageSquare,
  TrendingUp,
  Star,
} from "lucide-react";


import { type Tradespace, getTradespace } from "../../api/getTradespace";
import { TradespaceCard } from "../../components/TradespaceCard";

export const Route = createFileRoute("/_auth/search")({
  component: SearchPage,
});

function SearchPage() {
  const [tradespaces, setTradespaces] = useState<Tradespace[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  async function load() {
    const result = await getTradespace();

    // Quick console test
    console.log("All tradespaces fetched:", result);

    // Optional: check specifically for "tech-gadgets"
    const techGadgets = result.find(ts => ts.id === "tech-gadgets");
    if (techGadgets) {
      console.log("✅ Found 'tech-gadgets' document:", techGadgets);
    } else {
      console.log("❌ 'tech-gadgets' not found");
    }

    setTradespaces(result);
    setLoading(false);
  }
    load();
  }, []);
  

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <p>Loading tradespaces...</p>
      </div>
    );
  }

  const trending = tradespaces.filter((ts) => ts.trending);
  const standard = tradespaces.filter((ts) => !ts.trending);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl mb-2">Discover Tradespaces</h2>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Search tradespaces..." className="pl-10" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4 flex items-center gap-3">
          <ShoppingBag className="size-5 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Active Tradespaces</p>
            <p className="text-2xl">{tradespaces.length}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <Users className="size-5 text-purple-600" />
          <div>
            <p className="text-sm text-muted-foreground">Total Members</p>
            <p className="text-2xl">
              {tradespaces.reduce((sum, t) => sum + (t.members || 0), 0)}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <MessageSquare className="size-5 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Daily Activity</p>
            <p className="text-2xl">
              {tradespaces.reduce((sum, t) => sum + (t.postsPerDay || 0), 0)}
            </p>
          </div>
        </Card>
      </div>

      {/* Trending */}
      <div className="mb-8">
        <h3 className="text-lg flex items-center gap-2 mb-4">
          <TrendingUp className="size-5 text-orange-600" />
          Trending Now
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trending.map((ts) => (
            <TradespaceCard key={ts.id} tradespace={ts} />
          ))}
        </div>
      </div>

      {/* All Tradespaces */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">All Tradespaces</h3>

          <Button size="sm" variant="outline">
            <Star className="size-4 mr-2" />
            Most Popular
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {standard.map((ts) => (
            <TradespaceCard key={ts.id} tradespace={ts} />
          ))}
        </div>
      </div>
    </div>
  );
}
