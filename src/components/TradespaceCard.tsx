import { CheckCircle2, Plus, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import FallBackImage from '../../src/images/brokenimage.jpg';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import type { Tradespace } from '@/types/tradespace';
import { useAuth } from '@/context/AuthContext';
import { joinTradespace } from '@/api/joinTradespace';
import { leaveTradespace } from '@/api/leaveTradespace';

export function TradespaceCard({
  tradespace,
  joined,
}: {
  tradespace: Tradespace;
  joined: boolean;
}) {
  const { user } = useAuth();
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [hasJoined, setJoined] = useState(joined);

  const handleJoinTradespace = async () => {
    if (!user) return;
    setJoining(true);
    const uid = user.uid;
    await joinTradespace(tradespace.id, uid);
    setJoined(true);
    setJoining(false);
  };

  const handleLeaveTradespace = async () => {
    if (!user) return;
    setLeaving(true);
    try {
      const uid = user.uid;
      await leaveTradespace(tradespace.id, uid);
      setJoined(false);
    } catch (err) {
      console.error('Failed to leave tradespace', err);
    } finally {
      setLeaving(false);
    }
  };

  const [confirmOpen, setConfirmOpen] = useState(false);

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

        {!hasJoined ? (
          <Button
            disabled={joining}
            onClick={handleJoinTradespace}
            className="w-full gap-2"
          >
            <Plus className="size-4" />
            Join Tradespace
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => setConfirmOpen(true)}
              disabled={leaving}
              className="flex-1"
            >
              Leave
            </Button>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Leave Tradespace</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to leave{' '}
                    <strong>{tradespace.name}</strong>? You can rejoin at any
                    time.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await handleLeaveTradespace();
                      setConfirmOpen(false);
                    }}
                    disabled={leaving}
                  >
                    Leave
                  </Button>
                </DialogFooter>
                <DialogClose />
              </DialogContent>
            </Dialog>

            <Button disabled className="flex-1">
              Joined
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
