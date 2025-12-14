import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getDoc, collection, getDocs, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { getUserTradespaces } from '@/api/getUserTradespaces';
import { joinTradespace, leaveTradespace } from '@/lib/firestore';
import type { Tradespace } from '@/types/tradespace';

export const Route = createFileRoute('/_auth/tradespaces/$tradespaceId')({
  component: TradespaceDetailPage,
});

export function TradespaceDetailPage() {
  const { tradespaceId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tradespace, setTradespace] = useState<Tradespace | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function load() {
      // Load tradespace data
      const tsSnap = await getDoc(doc(db, 'tradespaces', tradespaceId));
      if (tsSnap.exists()) {
        setTradespace({ id: tsSnap.id, ...tsSnap.data() } as Tradespace);
      }

      // Load listings
      const listingsSnap = await getDocs(
        collection(db, 'tradespaces', tradespaceId, 'listings')
      );
      setListings(listingsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // Check if user has joined this tradespace
      if (user) {
        const userTradespaces = await getUserTradespaces(user.uid);
        const isJoined = userTradespaces.some((ts) => ts.id === tradespaceId);
        setHasJoined(isJoined);
      }
    }
    load();
  }, [tradespaceId, user]);

  const handleJoinLeave = async () => {
    if (!user || !tradespace) return;
    setLoading(true);
    
    try {
      if (hasJoined) {
        await leaveTradespace(user.uid, tradespaceId);
        setHasJoined(false);
        // Update local member count
        setTradespace({
          ...tradespace,
          memberCount: Math.max(0, (tradespace.memberCount || 0) - 1),
        });
        // Show confirmation message
        alert('You have left this tradespace');
        // Navigate back to dashboard
        navigate({ to: '/dashboard' });
      } else {
        await joinTradespace(user.uid, tradespaceId);
        setHasJoined(true);
        // Update local member count
        setTradespace({
          ...tradespace,
          memberCount: (tradespace.memberCount || 0) + 1,
        });
      }
    } catch (error) {
      console.error('Error joining/leaving tradespace:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!tradespace) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white border rounded-lg p-6 shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{tradespace.name}</h1>
            <p className="text-gray-600 mb-4">{tradespace.description}</p>
            <div className="flex gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span className="material-icons text-base">people</span>
                <span>{tradespace.memberCount || 0} members</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-icons text-base">inventory_2</span>
                <span>{tradespace.activeListings || 0} listings</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-icons text-base">calendar_today</span>
                <span>{tradespace.postsPerDay || 0} days up</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleJoinLeave}
            disabled={loading}
            className={`px-6 py-2 rounded font-medium transition-colors ${
              hasJoined
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            {loading ? 'Loading...' : hasJoined ? 'Leave' : 'Join'}
          </button>
        </div>
      </div>

      {/* Listings Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Listings</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.length === 0 ? (
            <p className="text-gray-500 col-span-full">No listings yet</p>
          ) : (
            listings.map((listing) => (
              <div
                key={listing.id}
                className="border rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition-shadow cursor-pointer"
              >
                <img
                  src={listing.images?.[0] || 'https://via.placeholder.com/400x300'}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{listing.title}</h3>
                  <p className="text-blue-600 font-bold text-xl">
                    ${listing.price}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {listing.condition || 'Good'}
                    </span>
                    <span className="text-gray-500">
                      by {listing.author || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Discussion Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Discussion</h2>
        <div className="border rounded-lg bg-white p-6 space-y-4 shadow">
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
              CP
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">CollectorPro</p>
                <span className="text-gray-400 text-sm">2 hours ago</span>
              </div>
              <p className="text-gray-700">
                Great collection! Are you open to trades on the camera?
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
              VS
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">VintageSeeker</p>
                <span className="text-gray-400 text-sm">5 hours ago</span>
              </div>
              <p className="text-gray-700">
                Really interested in the Omega watch. Can you provide more details
                about its history?
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
              TE
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">TechEnthusiast</p>
                <span className="text-gray-400 text-sm">1 day ago</span>
              </div>
              <p className="text-gray-700">
                Do you ship internationally? Looking at the headphones.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Join the discussion..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}