import { ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  function handleExplore() {
    if (loading) return;
    if (user) navigate({ to: '/search' });
    else navigate({ to: '/login' });
  }

  return (
    <div className="text-center max-w-2xl mx-auto grid gap-6">
      <h1 className="text-4xl md:text-5xl font-bold">
        A trading space for everyone.
      </h1>
      <p className="text-muted-foreground text-lg md:text-xl">
        Join communities dedicated to your passions. Buy, sell, and trade
        products with like-minded enthusiasts in a modern, collaborative
        environment.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="accent"
          size="lg"
          onClick={handleExplore}
          disabled={loading}
        >
          Explore Tradespaces <ArrowRight />
        </Button>
        <Button variant="outline" size="lg">
          Learn More
        </Button>
      </div>
    </div>
  );
};
