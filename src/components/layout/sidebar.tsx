import { useState } from 'react';
import {
  ChevronRight,
  FileText,
  Home,
  Mail,
  MessageSquare,
  Search,
  Settings,
  ShoppingBag,
} from 'lucide-react';
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
}) => (
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

interface TradespaceSectionProps {
  tradespace: string;
  matchRoute: ReturnType<typeof useMatchRoute>;
}

const TradespaceSection: React.FC<TradespaceSectionProps> = ({
  tradespace,
  matchRoute,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sections: Array<NavItem> = [
    { title: 'Products', url: `/${tradespace}/products`, icon: ShoppingBag },
    { title: 'Forums', url: `/${tradespace}/forums`, icon: MessageSquare },
    { title: 'Topics', url: `/${tradespace}/topics`, icon: FileText },
  ];

  const isAnyChildActive = sections.some((section) =>
    matchRoute({ to: section.url }),
  );

  return (
    <SidebarGroup className="gap-1">
      <SidebarGroupLabel>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
            isAnyChildActive
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          }`}
        >
          <ChevronRight
            className={`size-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-90' : 'rotate-0'
            }`}
          />
          <span className="flex-1 text-left">{tradespace}</span>
        </button>
      </SidebarGroupLabel>
      {isOpen && (
        <SidebarGroupContent>
          <SidebarMenu className="gap-1 ml-2">
            {sections.map((section) => {
              const isActive = matchRoute({ to: section.url });
              return (
                <SidebarMenuItem key={section.url}>
                  <SidebarMenuButton
                    className="transition pl-4"
                    isActive={isActive}
                    asChild
                  >
                    <Link to={section.url}>
                      {section.icon && <section.icon />}
                      <span>{section.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
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

  return (
    <Sidebar className="top-[50px]">
      <SidebarContent className="pt-4 px-2">
        <SidebarNavSection items={mainNavItems} matchRoute={matchRoute} />

        {tradespaces.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>TRADESPACES</SidebarGroupLabel>
              <SidebarGroupContent className="space-y-1">
                {tradespaces.map((tradespace) => (
                  <TradespaceSection
                    key={tradespace}
                    tradespace={tradespace}
                    matchRoute={matchRoute}
                  />
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        <SidebarSeparator />
        <SidebarNavSection items={extraNavItems} matchRoute={matchRoute} />
      </SidebarContent>
    </Sidebar>
  );
};
