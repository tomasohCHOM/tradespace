import { CheckCircle2, Plus, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import FallBackImage from '../../src/images/brokenimage.jpg';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { Tradespace } from '@/types/tradespace';
import { useAuth } from '@/context/AuthContext';
import { joinTradespace } from '@/api/joinTradespace';

export function TradespaceCard({
  tradespace,
  joined,
}: {
  tradespace: Tradespace;
  joined: boolean;
}) {
  const { user } = useAuth();
  const [joining, setJoining] = useState(false);
  const [hasJoined, setJoined] = useState(joined);

  const handleJoinTradespace = async () => {
    if (!user) return;
    setJoining(true);
    await joinTradespace(tradespace.id, user.uid);
    setJoined(true);
    setJoining(false);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="aspect-video bg-muted relative overflow-hidden">
        <img
          src={tradespace.thumbnailUrl}
          alt={tradespace.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          onError={(e) => {
            e.currentTarget.src = FallBackImage;
          }}
        />

        {tradespace.trending && (
          <Badge className="absolute top-2 left-2 bg-orange-500 gap-1">
            <TrendingUp className="size-3" />
            Trending
          </Badge>
        )}

        {tradespace.verified && (
          <Badge className="absolute top-2 right-2 bg-blue-600 gap-1">
            <CheckCircle2 className="size-3" />
            Verified
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="mb-1">{tradespace.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {tradespace.description}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {tradespace.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t text-center">
          <div>
            <p className="text-sm text-muted-foreground">Members</p>
            <p className="text-sm">{tradespace.memberCount}</p>
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

        <Button
          disabled={joining || hasJoined}
          onClick={handleJoinTradespace}
          className="w-full gap-2"
        >
          {hasJoined ? (
            'Joined'
          ) : (
            <>
              <Plus className="size-4" />
              Join Tradespace
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
