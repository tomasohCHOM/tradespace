import { Link } from '@tanstack/react-router';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UserOptions } from '@/components/layout/user-options';

export const Navbar: React.FC = () => {
  return (
    <nav className="w-full fixed p-2 bg-background border-border border-b">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <Link to="/">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="TradeSpace Logo" className="w-8" />
            <span className="md:text-lg font-bold">TradeSpace</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
};

function AuthButtons() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return (
      <>
        <Button variant="accent" size="sm" asChild>
          <Link to="/dashboard">Dashboard</Link>
        </Button>
        <UserOptions />
      </>
    );
  }

  return (
    <>
      <Button size="sm" variant="outline" asChild>
        <Link to="/login">Sign In</Link>
      </Button>
      <Button variant="accent" size="sm">
        Discover Tradespaces
      </Button>
    </>
  );
}
