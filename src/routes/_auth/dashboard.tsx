import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { Tradespace } from '@/types/tradespace';
import { useAuth } from '@/context/AuthContext';
import { getUserTradespaces } from '@/api/getUserTradespaces';
import { getTradespaces } from '@/api/getTradespaces';
import { TradespaceCard } from '@/components/TradespaceCard';

export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const [userTradespaces, setUserTradespaces] = useState<Array<Tradespace>>([]);
  const [allTradespaces, setAllTradespaces] = useState<Array<Tradespace>>([]);
  const navigate = useNavigate();

  const loadTradespaces = async () => {
    if (!user) return;

    const [userTS, allTS] = await Promise.all([
      getUserTradespaces(user.uid),
      getTradespaces(),
    ]);
    setUserTradespaces(userTS);
    setAllTradespaces(allTS);
  };

  useEffect(() => {
    loadTradespaces();
  }, [user]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadTradespaces();
      }
    };

    const handleFocus = () => {
      loadTradespaces();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  if (!user) return <div>Loading...</div>;

  const joinedIds = new Set(userTradespaces.map((t) => t.id));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl mb-4">My Tradespaces</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userTradespaces.length === 0 ? (
          <p className="text-gray-500 col-span-full">
            You haven't joined any tradespaces yet. Explore below to get
            started!
          </p>
        ) : (
          userTradespaces.map((ts) => (
            <div
              key={ts.id}
              onClick={() =>
                navigate({
                  to: '/tradespaces/$tradespaceId' as any,
                  params: { tradespaceId: ts.id } as any,
                })
              }
            >
              <TradespaceCard tradespace={ts} joined={true} />
            </div>
          ))
        )}
      </div>

      <h2 className="text-2xl mt-8 mb-4">Explore More Tradespaces</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTradespaces
          .filter((ts) => !joinedIds.has(ts.id))
          .map((ts) => (
            <div
              key={ts.id}
              onClick={() =>
                navigate({
                  to: '/tradespaces/$tradespaceId' as any,
                  params: { tradespaceId: ts.id } as any,
                })
              }
            >
              <TradespaceCard tradespace={ts} joined={false} />
            </div>
          ))}
      </div>
    </div>
  );
}
