import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="">
      <nav className="w-full fixed p-2 bg-background border-border border-b">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <a href="/">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="TradeSpace Logo" className="w-8" />
              <span className="text-lg font-bold">TradeSpace</span>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              Sign In
            </Button>
            <Button size="sm">Discover spaces</Button>
          </div>
        </div>
      </nav>
      <main className="pt-24 max-w-5xl mx-auto grid gap-4">
        <div className="pt-12 text-center max-w-2xl mx-auto grid gap-6">
          <h1 className="text-5xl font-bold">A trading space for everyone.</h1>
          <p className="text-muted-foreground text-xl">
            Join communities dedicated to your passions. Buy, sell, and trade
            products with like-minded enthusiasts in a modern, collaborative
            environment.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg">
              Explore Tradespaces <ArrowRight />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
