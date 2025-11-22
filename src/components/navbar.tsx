import type React from 'react';
import { Button } from '@/components/ui/button';

export const Navbar: React.FC = () => {
  return (
    <nav className="w-full fixed p-2 bg-background border-border border-b">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <a href="/">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="TradeSpace Logo" className="w-8" />
            <span className="md:text-lg font-bold">TradeSpace</span>
          </div>
        </a>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Sign In
          </Button>
          <Button variant="accent" size="sm">
            Discover Tradespaces
          </Button>
        </div>
      </div>
    </nav>
  );
};
