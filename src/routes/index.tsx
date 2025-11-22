import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  const features = [
    {
      title: 'Marketplace',
      desc: 'Browse and list products in dedicated tradespaces. Set prices, negotiate offers, and complete trades seamlessly.',
    },
    {
      title: 'Forums',
      desc: 'Engage in discussions, share tips, and connect with community members who share your interests.',
    },
    {
      title: 'Community',
      desc: 'Join topic-specific communities where you can collaborate, learn, and grow your network.',
    },
  ];

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
            <Button size="sm">Discover Tradespaces</Button>
          </div>
        </div>
      </nav>
      <main className="pt-36 pb-16 max-w-5xl mx-auto grid gap-24">
        <div className="text-center max-w-2xl mx-auto grid gap-6">
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
        <div className="text-center grid gap-6">
          <h2 className="text-3xl font-bold">A Tradespace for Everything.</h2>
          <img
            src="/tradespace.png"
            alt="Tradespace example"
            className="border-border border rounded-2xl shadow-xl"
          />
        </div>
        <div className="text-center grid gap-12">
          <h2 className="text-3xl font-bold">
            <span className="block">Join Online Communities.</span>
            <span className="block">Buy, Sell, and Trade!</span>
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>{feature.desc}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
