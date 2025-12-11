import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  MessageSquare,
  Plus,
  Search,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

import { getTradespace } from '../../api/getTradespace';
import { createTradespace } from '../../api/createTradespace';
import { TradespaceCard } from '../../components/TradespaceCard';
import type { Tradespace } from '../../api/getTradespace';

export const Route = createFileRoute('/_auth/search')({
  component: SearchPage,
});

function SearchPage() {
  const [tradespaces, setTradespaces] = useState<Array<Tradespace>>([]);
  const [loading, setLoading] = useState(true);

  // Create form state
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    async function load() {
      const result = await getTradespace();
      setTradespaces(result);
      setLoading(false);
    }
    load();
  }, []);

  async function handleCreate() {
    if (!thumbnailFile) {
      alert('Please upload a thumbnail image.');
      return;
    }

    const newTs = await createTradespace({
      name,
      description,
      thumbnailFile,
    });

    setTradespaces((prev) => [newTs, ...prev]);
    setOpenCreate(false);
    setName('');
    setDescription('');
    setThumbnailFile(null);
  }

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl">Discover Tradespaces</h2>

        <Button onClick={() => setOpenCreate(true)} className="gap-2">
          <Plus className="size-4" /> Create Tradespace
        </Button>
      </div>

      {/* Create Tradespace Modal */}
      {openCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-[400px] space-y-4 z-50 relative">
            <h3 className="text-lg font-semibold">Create New Tradespace</h3>

            <Input
              placeholder="Tradespace Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenCreate(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </div>
          </Card>
        </div>
      )}

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
        <h3 className="text-lg mb-4">All Tradespaces</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {standard.map((ts) => (
            <TradespaceCard key={ts.id} tradespace={ts} />
          ))}
        </div>
      </div>
    </div>
  );
}
