import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { Tradespace } from '@/types/tradespace';
import { useAuth } from '@/context/AuthContext';
import { getUserTradespaces } from '@/api/getUserTradespaces';

import { PageContent } from '@/components/layout/content';
import { LayoutNavbar } from '@/components/layout/navbar';
import { LayoutSidebar } from '@/components/layout/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export const Route = createFileRoute('/_auth')({
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tradespaces, setTradespaces] = useState<Array<Tradespace>>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/login' });
    }
  }, [user, loading, navigate]);


   useEffect(() => {
    if (!user) return;

    getUserTradespaces(user.uid).then(setTradespaces);
  }, [user]);

 if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

   if (!user) return null;

  return (
    <SidebarProvider>
      <LayoutNavbar />
      {/* pass tradespaces from firebase */}
      <LayoutSidebar tradespaces={tradespaces} />
      <PageContent>
        <Outlet />
      </PageContent>
    </SidebarProvider>
  );
}
