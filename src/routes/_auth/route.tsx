import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

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

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/login' });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <SidebarProvider>
        <LayoutNavbar />
        <LayoutSidebar tradespaces={['TechContent']} />
        <PageContent>
          <Outlet />
        </PageContent>
      </SidebarProvider>
    </div>
  );
}
