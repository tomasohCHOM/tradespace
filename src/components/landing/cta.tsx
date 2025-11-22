import type React from 'react';
import { Button } from '@/components/ui/button';

export const CTA: React.FC = () => {
  return (
    <div
      className="min-h-[250px] flex flex-col items-center justify-center
          gap-8 bg-linear-to-br from-accent-blue to-accent-purple rounded-2xl"
    >
      <h2 className="text-6xl font-bold text-background">
        Ready to start trading?
      </h2>
      <Button variant="outline" className="w-[min(100%,30rem)] font-bold">
        Get Started Today
      </Button>
    </div>
  );
};
