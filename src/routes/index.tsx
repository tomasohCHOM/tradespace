import { createFileRoute } from '@tanstack/react-router';
import { Footer } from '@/components/footer';
import { Features } from '@/components/landing/features';
import { CTA } from '@/components/landing/cta';
import { Hero } from '@/components/landing/hero';
import { Product } from '@/components/landing/product';
import { Navbar } from '@/components/navbar';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-36 pb-16 max-w-5xl mx-auto px-8 lg:px-0 grid gap-24">
        <Hero />
        <Product />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
