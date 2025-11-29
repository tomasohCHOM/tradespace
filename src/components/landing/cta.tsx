import { Link } from '@tanstack/react-router';
import type React from 'react';
import { Button } from '@/components/ui/button';

export const CTA: React.FC = () => {
  return (
    <div
      className="min-h-[250px] p-4 flex flex-col items-center justify-center
          gap-8 bg-linear-to-br from-accent-blue to-accent-purple rounded-2xl"
    >
      <h2 className="text-center text-3xl md:text-6xl font-bold text-background">
        Ready to start trading?
      </h2>
      <Button variant="outline" className="w-60 md:w-120 font-bold" asChild>
        <Link to="/login">Get Started Today</Link>
      </Button>
    </div>
  );
};
