import { Home, Mail, Search, Settings } from 'lucide-react';
import { Link, useMatchRoute } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';

type NavItem = {
  title: string;
  url: string;
  icon?: React.ElementType;
};

type SidebarNavSectionProps = {
  items: Array<NavItem>;
  matchRoute: ReturnType<typeof useMatchRoute>;
  label?: string;
};

const SidebarNavSection: React.FC<SidebarNavSectionProps> = ({
  items,
  matchRoute,
  label,
}) => {
  return (
    <SidebarGroup className="gap-4">
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu className="gap-2">
          {items.map((item) => {
            const isActive = !!matchRoute({ to: item.url });
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  className="transition"
                  isActive={isActive}
                  asChild
                >
                  <Link to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

type Props = {
  tradespaces: Array<string>;
};

export const LayoutSidebar: React.FC<Props> = ({ tradespaces }) => {
  const matchRoute = useMatchRoute();

  const mainNavItems: Array<NavItem> = [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    { title: 'Explore', url: '/search', icon: Search },
    { title: 'Messages', url: '/messages', icon: Mail },
  ];

  const extraNavItems: Array<NavItem> = [
    { title: 'Settings', url: '/settings', icon: Settings },
  ];

  const tradespacesNavItems: Array<NavItem> = tradespaces.map((tradespace) => ({
    title: tradespace,
    url: `/${tradespace}`,
  }));

  return (
    <Sidebar className="top-[50px]">
      <SidebarContent className="pt-4 px-2">
        <SidebarNavSection items={mainNavItems} matchRoute={matchRoute} />

        {tradespaces.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarNavSection
              label="TRADESPACES"
              items={tradespacesNavItems}
              matchRoute={matchRoute}
            />
          </>
        )}

        <SidebarSeparator />

        <SidebarNavSection items={extraNavItems} matchRoute={matchRoute} />
      </SidebarContent>
    </Sidebar>
  );
};
