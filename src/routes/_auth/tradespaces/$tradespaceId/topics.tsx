import { createFileRoute, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  Eye,
  Heart,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  MessageSquare,
  Pin,
  ShoppingBag,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_auth/tradespaces/$tradespaceId/topics')(
  {
    component: Topics,
  },
);

interface Topic {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
    initials: string;
  };
  type: 'announcement' | 'discussion' | 'marketplace' | 'showcase';
  stats: {
    likes: number;
    comments: number;
    views: number;
  };
  tags: Array<string>;
  imageUrl?: string;
  pinned?: boolean;
  timestamp: string;
}

// Helper to generate topics based on name
const getTopicsForTradespace = (name: string): Array<Topic> => {
  const normalize = (n: string) => n.toLowerCase().trim();
  const n = normalize(name);

  const defaults: Array<Topic> = [
    {
      id: 'd1',
      title: 'Welcome to the Community!',
      excerpt: 'Please read the guidelines before posting.',
      author: { name: 'Mod', initials: 'M' },
      type: 'announcement',
      stats: { likes: 10, comments: 2, views: 100 },
      tags: ['Welcome'],
      pinned: true,
      timestamp: '1 day ago',
    },
  ];

  if (n.includes('autobody')) {
    return [
      {
        id: 'ab1',
        title: 'Best Clear Coat for Beginners?',
        excerpt:
          'I am working on my first fender repair. Looking for recommendations on a forgiving clear coat.',
        author: { name: 'SprayGunz', initials: 'SG' },
        type: 'discussion',
        stats: { likes: 45, comments: 12, views: 340 },
        tags: ['Paint', 'Help'],
        timestamp: '2 hours ago',
      },
      {
        id: 'ab2',
        title: 'Showcase: 69 Camaro Full Restoration',
        excerpt:
          'Finally verified the body lines. Ready for primer. Check out the progress pics.',
        author: { name: 'MuscleMike', initials: 'MM' },
        type: 'showcase',
        stats: { likes: 230, comments: 45, views: 1200 },
        tags: ['Restoration', 'Classic'],
        imageUrl:
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
        timestamp: '5 hours ago',
      },
      {
        id: 'ab3',
        title: 'FS: unused Iwata Airbrush',
        excerpt: 'Bought it but never used it. Still in box. $150 shipped.',
        author: { name: 'DetailerDan', initials: 'DD' },
        type: 'marketplace',
        stats: { likes: 12, comments: 4, views: 89 },
        tags: ['For Sale', 'Tools'],
        timestamp: '1 day ago',
      },
    ];
  }

  if (n.includes('reptile')) {
    return [
      {
        id: 'r1',
        title: 'Bearded Dragon Lighting Guide 2024',
        excerpt: 'Updated list of recommended UVB bulbs and safe distances.',
        author: { name: 'DrHerp', initials: 'DH' },
        type: 'announcement',
        stats: { likes: 567, comments: 89, views: 5000 },
        pinned: true,
        tags: ['Care Guide', 'Lighting'],
        timestamp: '1 week ago',
      },
      {
        id: 'r2',
        title: 'Look at my new Bearded Dragon!',
        excerpt: 'Just picked him up from the expo. Named him Spike.',
        author: { name: 'LizardLover', initials: 'LL' },
        type: 'showcase',
        stats: { likes: 123, comments: 34, views: 890 },
        imageUrl:
          'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=800&q=80',
        tags: ['Bearded Dragon', 'New Pet'],
        timestamp: '3 hours ago',
      },
      {
        id: 'r3',
        title: 'Breeding Ball Pythons - Incubator Temps?',
        excerpt: 'Having trouble keeping consistent humidity. Any tips?',
        author: { name: 'SnakeCharmer', initials: 'SC' },
        type: 'discussion',
        stats: { likes: 23, comments: 15, views: 210 },
        tags: ['Breeding', 'Help'],
        timestamp: '1 day ago',
      },
    ];
  }

  if (n.includes('pokemon')) {
    return [
      {
        id: 'p1',
        title: 'Do not buy from "PokeKing99" - Scammer Alert',
        excerpt: 'Sent me a resealed pack. Evidence inside.',
        author: { name: 'CardCop', initials: 'CC' },
        type: 'announcement',
        stats: { likes: 890, comments: 120, views: 10000 },
        pinned: true,
        tags: ['Alert', 'Safety'],
        timestamp: '2 hours ago',
      },
      {
        id: 'p2',
        title: 'My GRAIL obtained! 1st Ed Charizard PSA 8',
        excerpt: 'Trades my entire modern collection for this. Worth it?',
        author: { name: 'AshK', initials: 'AK' },
        type: 'showcase',
        stats: { likes: 1500, comments: 300, views: 5600 },
        imageUrl:
          'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&q=80',
        tags: ['Grail', 'Vintage'],
        timestamp: '10 minutes ago',
      },
      {
        id: 'p3',
        title: 'WTB: Moonbreon (Umbreon VMAX Alt Art)',
        excerpt: 'Looking for raw NM/M copy. Have PayPal ready.',
        author: { name: 'EveeFan', initials: 'EF' },
        type: 'marketplace',
        stats: { likes: 45, comments: 12, views: 400 },
        tags: ['WTB', 'Modern'],
        timestamp: '4 hours ago',
      },
    ];
  }

  if (n.includes('fitness')) {
    return [
      {
        id: 'f1',
        title: 'New Year Challenge - Sign Ups Open!',
        excerpt: 'Join us for the 90-day transformation challenge.',
        author: { name: 'GymMod', initials: 'GM' },
        type: 'announcement',
        stats: { likes: 345, comments: 120, views: 2300 },
        pinned: true,
        tags: ['Challenge', 'Community'],
        timestamp: '3 days ago',
      },
      {
        id: 'f2',
        title: 'Form Check: Deadlift 315lbs',
        excerpt: 'Back feels a bit rounded. Constructive criticism welcome.',
        author: { name: 'LifterJoe', initials: 'LJ' },
        type: 'discussion',
        stats: { likes: 67, comments: 45, views: 890 },
        tags: ['Form Check', 'Powerlifting'],
        timestamp: '8 hours ago',
      },
      {
        id: 'f3',
        title: 'Selling: Powerblock Dumbbells (5-50lbs)',
        excerpt: 'Local pickup only. Great condition.',
        author: { name: 'HomeGymHero', initials: 'HH' },
        type: 'marketplace',
        stats: { likes: 23, comments: 5, views: 150 },
        tags: ['Sale', 'Equipment'],
        timestamp: '1 day ago',
      },
    ];
  }

  if (n.includes('samsung')) {
    return [
      {
        id: 's1',
        title: 'S24 Ultra Camera Settings Guide',
        excerpt: 'How to get the most out of the 200MP sensor.',
        author: { name: 'TechSnap', initials: 'TS' },
        type: 'discussion',
        stats: { likes: 450, comments: 89, views: 6000 },
        tags: ['Photography', 'Guide'],
        timestamp: '1 week ago',
      },
      {
        id: 's2',
        title: 'One UI 6.1 Update Megathread',
        excerpt: 'Post bugs, features, and battery life reports here.',
        author: { name: 'AndroidFan', initials: 'AF' },
        type: 'announcement',
        stats: { likes: 200, comments: 500, views: 8000 },
        pinned: true,
        tags: ['Update', 'Software'],
        timestamp: '2 days ago',
      },
      {
        id: 's3',
        title: 'Galaxy Buds 2 Pro vs Sony XM5',
        excerpt: 'My honest comparison after 1 month of use.',
        author: { name: 'Audiophile', initials: 'AP' },
        type: 'discussion',
        stats: { likes: 89, comments: 34, views: 1200 },
        tags: ['Review', 'Audio'],
        timestamp: '5 hours ago',
      },
    ];
  }

  if (n.includes('anime')) {
    return [
      {
        id: 'a1',
        title: 'Weekly Episode Discussion: One Piece',
        excerpt: 'Spoilers inside! That animation was insane!',
        author: { name: 'LuffyFan', initials: 'LF' },
        type: 'discussion',
        stats: { likes: 5000, comments: 1200, views: 25000 },
        pinned: true,
        tags: ['Weekly', 'Spoilers'],
        timestamp: '1 day ago',
      },
      {
        id: 'a2',
        title: 'Showcase: My Figure Collection Update',
        excerpt:
          'Added the new scale Alter figure. Running out of shelf space.',
        author: { name: 'OtakuKing', initials: 'OK' },
        type: 'showcase',
        stats: { likes: 450, comments: 67, views: 3400 },
        imageUrl:
          'https://images.unsplash.com/photo-1541562232579-512a21360020?w=800&q=80',
        tags: ['Figures', 'Collection'],
        timestamp: '6 hours ago',
      },
      {
        id: 'a3',
        title: 'WTB: OOP Blue Ray Sets',
        excerpt: 'Looking for Gurren Lagann limited edition box set.',
        author: { name: 'DiskCollector', initials: 'DC' },
        type: 'marketplace',
        stats: { likes: 45, comments: 8, views: 230 },
        tags: ['WTB', 'Media'],
        timestamp: '2 days ago',
      },
    ];
  }

  if (n.includes('video game')) {
    return [
      {
        id: 'v1',
        title: 'LFG: Raid Team for Tonight',
        excerpt: 'Need 2 DPS and 1 Healer. Must have mic. Starting 8PM EST.',
        author: { name: 'RaidLead', initials: 'RL' },
        type: 'discussion',
        stats: { likes: 12, comments: 8, views: 60 },
        tags: ['LFG', 'Multiplayer'],
        timestamp: '4 hours ago',
      },
      {
        id: 'v2',
        title: 'Hidden Gems on Steam Sale?',
        excerpt: 'What are you picking up for under $10?',
        author: { name: 'ThriftyGamer', initials: 'TG' },
        type: 'discussion',
        stats: { likes: 340, comments: 120, views: 4500 },
        imageUrl:
          'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
        tags: ['Deals', 'PC'],
        timestamp: '1 day ago',
      },
      {
        id: 'v3',
        title: 'Selling: PS5 Disc Edition + 2 Controllers',
        excerpt: 'Moving, need gone. $400 firm.',
        author: { name: 'ConsoleSeller', initials: 'CS' },
        type: 'marketplace',
        stats: { likes: 56, comments: 12, views: 890 },
        tags: ['WTS', 'PlayStation'],
        timestamp: '2 hours ago',
      },
    ];
  }

  if (n.includes('mac') || n.includes('apple')) {
    return [
      {
        id: 'm1',
        title: 'M3 MacBook Air: Is 8GB RAM enough?',
        excerpt: 'For web browsing and light coding. Thoughts?',
        author: { name: 'StudenDev', initials: 'SD' },
        type: 'discussion',
        stats: { likes: 120, comments: 340, views: 8900 },
        tags: ['Advice', 'Hardware'],
        timestamp: '5 hours ago',
      },
      {
        id: 'm2',
        title: 'My Desk Setup - Minimalist Mac',
        excerpt: 'Studio Display + Mac Mini. Cable management is key.',
        author: { name: 'CleanDesk', initials: 'CD' },
        type: 'showcase',
        stats: { likes: 890, comments: 45, views: 5600 },
        imageUrl:
          'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
        tags: ['Setup', 'Workspace'],
        timestamp: '2 days ago',
      },
      {
        id: 'm3',
        title: 'FS: Magic Keyboard & Trackpad',
        excerpt: 'Space Grey. Like new condition.',
        author: { name: 'Upgrader', initials: 'UG' },
        type: 'marketplace',
        stats: { likes: 34, comments: 5, views: 120 },
        tags: ['Accessories', 'Sale'],
        timestamp: '1 day ago',
      },
    ];
  }

  if (n.includes('cars')) {
    return [
      {
        id: 'c1',
        title: 'Track Day Prep Checklist',
        excerpt: 'Brake fluid, tires, oil... what else am I missing?',
        author: { name: 'SpeedRacer', initials: 'SR' },
        type: 'discussion',
        stats: { likes: 230, comments: 67, views: 1200 },
        tags: ['Track', 'Guide'],
        timestamp: '3 days ago',
      },
      {
        id: 'c2',
        title: 'Spotted: R34 GTR locally!',
        excerpt: 'Saw this legend at the gas station. Owner was super chill.',
        author: { name: 'JDM_Fan', initials: 'JF' },
        type: 'showcase',
        stats: { likes: 4500, comments: 230, views: 45000 },
        imageUrl:
          'https://images.unsplash.com/photo-1658162083129-5e008c4e5747?q=80&w=601',

        tags: ['Spotting', 'JDM'],
        timestamp: '5 hours ago',
      },
      {
        id: 'c3',
        title: 'Part out: 2015 WRX STI',
        excerpt: 'Engine blown. Everything else available. DM for prices.',
        author: { name: 'SubieBro', initials: 'SB' },
        type: 'marketplace',
        stats: { likes: 45, comments: 89, views: 2300 },
        tags: ['Partout', 'Parts'],
        timestamp: '1 day ago',
      },
    ];
  }
  if (n.includes('fruit')) {
    return [
      {
        id: 'fr1',
        title: 'Best Apples for Pie?',
        excerpt: 'Granny Smith vs Honeycrisp? Fighting with my grandma.',
        author: { name: 'BakerBoy', initials: 'BB' },
        type: 'discussion',
        stats: { likes: 45, comments: 120, views: 560 },
        tags: ['Cooking', 'Debate'],
        timestamp: '2 days ago',
      },
      {
        id: 'fr2',
        title: 'My Dragonfruit Cactus finally bloomed!',
        excerpt: 'Took 3 years but look at this flower.',
        author: { name: 'GreenThumb', initials: 'GT' },
        type: 'showcase',
        stats: { likes: 670, comments: 45, views: 2300 },
        tags: ['Gardening', 'Exotic'],
        imageUrl:
          'https://images.unsplash.com/photo-1613229178621-7835120082fd?q=80&w=987',
        timestamp: '12 hours ago',
      },
      {
        id: 'fr3',
        title: 'Local Farmer Market Haul',
        excerpt: 'Got all this for $20. Support local!',
        author: { name: 'HealthyEats', initials: 'HE' },
        type: 'discussion',
        stats: { likes: 230, comments: 23, views: 890 },
        tags: ['Local', 'Fresh'],
        timestamp: 'Sunday',
      },
    ];
  }

  if (n.includes('cat')) {
    return [
      {
        id: 'ct1',
        title: 'My cat keeps knocking water over',
        excerpt: 'Bought a fountain, he broke it. Help.',
        author: { name: 'WetSocks', initials: 'WS' },
        type: 'discussion',
        stats: { likes: 567, comments: 230, views: 5600 },
        tags: ['Behavior', 'Help'],
        timestamp: '4 hours ago',
      },
      {
        id: 'ct2',
        title: 'Caturday Megathread - Post your loafs',
        excerpt: 'Weekly loaf check. 10/10 forms only.',
        author: { name: 'MeowMod', initials: 'MM' },
        type: 'showcase',
        stats: { likes: 4500, comments: 560, views: 23000 },
        pinned: true,
        tags: ['Megathread', 'Fun'],
        timestamp: '2 days ago',
      },
      {
        id: 'ct3',
        title: 'Review: New Litter Robot',
        excerpt: 'Is it worth $600? Short answer: Yes.',
        author: { name: 'TechOwner', initials: 'TO' },
        type: 'discussion',
        stats: { likes: 230, comments: 120, views: 4500 },
        imageUrl:
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
        tags: ['Review', 'Gear'],
        timestamp: '1 week ago',
      },
    ];
  }

  // Fallback
  return defaults;
};

const getTypeIcon = (type: Topic['type']) => {
  switch (type) {
    case 'announcement':
      return <Pin className="size-4" />;
    case 'marketplace':
      return <ShoppingBag className="size-4" />;
    case 'showcase':
      return <ImageIcon className="size-4" />;
    case 'discussion':
      return <MessageSquare className="size-4" />;
  }
};

const getBadgeColor = (type: Topic['type']) => {
  switch (type) {
    case 'announcement':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'marketplace':
      return 'bg-green-500 hover:bg-green-600';
    case 'showcase':
      return 'bg-purple-500 hover:bg-purple-600';
    case 'discussion':
      return 'bg-slate-500 hover:bg-slate-600';
  }
};

function Topics() {
  const { tradespaceId } = useParams({
    from: '/_auth/tradespaces/$tradespaceId/topics',
  });
  const [topics, setTopics] = useState<Array<Topic>>([]);
  const [loading, setLoading] = useState(true);
  const [tradespaceName, setTradespaceName] = useState('');

  useEffect(() => {
    async function loadTopics() {
      setLoading(true);
      try {
        // Fetch tradespace name
        const ref = doc(db, 'tradespaces', tradespaceId);
        const snap = await getDoc(ref);
        let name = '';
        if (snap.exists()) {
          name = snap.data().name || '';
        }

        setTradespaceName(name);
        setTopics(getTopicsForTradespace(name));
      } catch (e) {
        console.error('Failed to load topics', e);
        setTopics(getTopicsForTradespace('')); // defaults
      } finally {
        setLoading(false);
      }
    }

    if (tradespaceId) {
      loadTopics();
    }
  }, [tradespaceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {tradespaceName
              ? `Topics in ${tradespaceName}`
              : 'Community Topics'}
          </h2>
          <p className="text-muted-foreground">
            Join the discussion, share your finds, or trade with others.
          </p>
        </div>
        <Button>
          <MessageSquare className="mr-2 size-4" />
          New Topic
        </Button>
      </div>

      <div className="grid gap-4">
        {topics.map((topic) => (
          <Card
            key={topic.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex gap-4">
              {/* Vote/Score Sidebar (Desktop) */}
              <div className="hidden sm:flex flex-col items-center gap-1 text-muted-foreground w-12 pt-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Heart className="size-4" />
                </Button>
                <span className="text-sm font-medium text-foreground">
                  {topic.stats.likes}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                {/* Header: Author & Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Avatar className="size-6">
                      <AvatarImage src={topic.author.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {topic.author.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium hover:underline">
                      {topic.author.name}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {topic.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {topic.pinned && (
                      <Badge variant="secondary" className="gap-1">
                        <Pin className="size-3" />
                        Pinned
                      </Badge>
                    )}
                    <Badge className={getBadgeColor(topic.type)}>
                      <span className="flex items-center gap-1">
                        {getTypeIcon(topic.type)}
                        <span className="capitalize">{topic.type}</span>
                      </span>
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {topic.excerpt}
                    </p>
                  </div>
                  {topic.imageUrl && (
                    <div className="hidden md:block w-32 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={topic.imageUrl}
                        alt="Topic thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                </div>

                {/* Footer: Tags & Stats */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    {topic.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs text-muted-foreground font-normal"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground sm:pr-4">
                    {/* Mobile Only Likes */}
                    <div className="flex sm:hidden items-center gap-1">
                      <Heart className="size-3" />
                      <span>{topic.stats.likes}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MessageCircle className="size-3" />
                      <span>{topic.stats.comments} Comments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="size-3" />
                      <span>{topic.stats.views} Views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
