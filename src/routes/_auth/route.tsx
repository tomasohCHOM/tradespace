import { Outlet, createFileRoute } from '@tanstack/react-router';
import { PageContent } from '@/components/layout/content';
import { LayoutNavbar } from '@/components/layout/navbar';
import { LayoutSidebar } from '@/components/layout/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export const Route = createFileRoute('/_auth')({
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
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
